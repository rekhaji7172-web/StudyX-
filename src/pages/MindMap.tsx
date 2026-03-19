/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Rect, Text, Line, Group, Circle } from 'react-konva';
import { 
  Plus, 
  Trash2, 
  Download, 
  MousePointer2, 
  Layout as LayoutIcon,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  X,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MindMapNode, MindMapEdge } from '../types';
import { useParams, useNavigate } from 'react-router-dom';
import { useMindMaps } from '../hooks/useStudyData';

const NODE_WIDTH = 140;
const NODE_HEIGHT = 50;
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

export default function MindMapPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mindMaps, addMindMap, updateMindMap, deleteMindMap } = useMindMaps();
  
  const currentMap = mindMaps.find(m => m.id === id);

  const [nodes, setNodes] = useState<MindMapNode[]>([]);
  const [edges, setEdges] = useState<MindMapEdge[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(() => !localStorage.getItem('studyx_mindmap_guided'));

  useEffect(() => {
    if (currentMap) {
      setNodes(currentMap.nodes);
      setEdges(currentMap.edges);
    } else if (id) {
      // If ID provided but not found, redirect to dashboard
      navigate('/');
    } else if (mindMaps.length > 0) {
      // If no ID provided but maps exist, pick first
      navigate(`/mindmap/${mindMaps[0].id}`);
    } else {
      // Create initial map if none exist
      const newMap = addMindMap('My First Mind Map', [
        { id: 'root', text: 'Central Topic', x: 400, y: 300, color: '#4f46e5' }
      ]);
      navigate(`/mindmap/${newMap.id}`);
    }
  }, [currentMap, id, mindMaps.length]);

  useEffect(() => {
    if (isFirstTime) {
      setShowHelp(true);
      localStorage.setItem('studyx_mindmap_guided', 'true');
      setIsFirstTime(false);
    }
  }, [isFirstTime]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // Linking state
  const [linkingFrom, setLinkingFrom] = useState<string | null>(null);
  const [tempLine, setTempLine] = useState<{ x1: number, y1: number, x2: number, y2: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);

  // Persistence
  const saveChanges = useCallback(() => {
    if (currentMap) {
      updateMindMap(currentMap.id, { nodes, edges });
    }
  }, [currentMap, nodes, edges, updateMindMap]);

  useEffect(() => {
    const timer = setTimeout(saveChanges, 1000);
    return () => clearTimeout(timer);
  }, [nodes, edges, saveChanges]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({ 
          width: containerRef.current.clientWidth, 
          height: containerRef.current.clientHeight 
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleAddNode = (parentId?: string) => {
    const parent = parentId ? nodes.find(n => n.id === parentId) : null;
    const newNode: MindMapNode = {
      id: Math.random().toString(36).substr(2, 9),
      text: 'New Idea',
      x: parent ? parent.x + 200 : dimensions.width / 2 - NODE_WIDTH / 2,
      y: parent ? parent.y + (Math.random() * 60 - 30) : dimensions.height / 2 - NODE_HEIGHT / 2,
      color: parent ? parent.color : COLORS[Math.floor(Math.random() * COLORS.length)]
    };
    
    setNodes(prev => [...prev, newNode]);
    if (parentId) {
      setEdges(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), from: parentId, to: newNode.id }]);
    }
    setSelectedId(newNode.id);
    setEditingId(newNode.id);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.from !== nodeId && e.to !== nodeId));
    if (selectedId === nodeId) setSelectedId(null);
  };

  const handleNodeDrag = (id: string, x: number, y: number) => {
    // Simple overlap prevention
    const updatedNodes = nodes.map(n => {
      if (n.id === id) return { ...n, x, y };
      
      // If too close, push away slightly
      const dx = n.x - x;
      const dy = n.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = 120;
      
      if (distance < minDistance && distance > 0) {
        const angle = Math.atan2(dy, dx);
        return {
          ...n,
          x: x + Math.cos(angle) * minDistance,
          y: y + Math.sin(angle) * minDistance
        };
      }
      return n;
    });
    setNodes(updatedNodes);
  };

  const startLinking = (nodeId: string, e: any) => {
    e.cancelBubble = true;
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    setLinkingFrom(nodeId);
    setTempLine({
      x1: node.x + NODE_WIDTH,
      y1: node.y + NODE_HEIGHT / 2,
      x2: node.x + NODE_WIDTH,
      y2: node.y + NODE_HEIGHT / 2
    });
  };

  const updateTempLine = (e: any) => {
    if (!linkingFrom || !tempLine) return;
    const stage = stageRef.current;
    const pointer = stage.getPointerPosition();
    const scale = stage.scaleX();
    const x = (pointer.x - stage.x()) / scale;
    const y = (pointer.y - stage.y()) / scale;
    setTempLine({ ...tempLine, x2: x, y2: y });
  };

  const finishLinking = (targetId: string) => {
    if (linkingFrom && linkingFrom !== targetId) {
      const exists = edges.some(e => (e.from === linkingFrom && e.to === targetId) || (e.from === targetId && e.to === linkingFrom));
      if (!exists) {
        setEdges(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), from: linkingFrom, to: targetId }]);
      }
    }
    setLinkingFrom(null);
    setTempLine(null);
  };

  const handleStageClick = (e: any) => {
    if (e.target === stageRef.current) {
      setSelectedId(null);
      setEditingId(null);
      if (linkingFrom) {
        setLinkingFrom(null);
        setTempLine(null);
      }
    }
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.2, Math.min(3, newScale));

    setStageScale(clampedScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-zinc-50 rounded-[2.5rem] border border-zinc-200 overflow-hidden relative shadow-inner premium-card">
      {/* Header / Controls */}
      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <button 
            onClick={() => navigate('/')}
            className="p-3 bg-white rounded-2xl border border-zinc-200 text-zinc-500 hover:text-zinc-900 shadow-xl transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="premium-card px-6 py-3 flex items-center gap-3 shadow-xl border-brand-100">
            <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-200">
              <LayoutIcon size={20} />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 uppercase tracking-tighter">{currentMap?.title || 'Mind Canvas'}</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visual Learning</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button 
            onClick={() => {
              if (confirm('Are you sure you want to delete this mind map?')) {
                deleteMindMap(currentMap!.id);
                navigate('/');
              }
            }}
            className="p-3 bg-white rounded-2xl border border-zinc-200 text-zinc-400 hover:text-red-500 shadow-xl transition-all active:scale-95"
            title="Delete Mind Map"
          >
            <Trash2 size={20} />
          </button>
          <button 
            onClick={() => setShowHelp(true)}
            className="p-3 bg-white rounded-2xl border border-zinc-200 text-zinc-500 hover:text-brand-600 shadow-xl transition-all active:scale-95"
            title="Help"
          >
            <HelpCircle size={20} />
          </button>
          <button 
            onClick={() => handleAddNode()}
            className="flex items-center gap-2 premium-gradient px-6 py-3 text-sm text-white font-bold rounded-2xl shadow-xl shadow-brand-100 active:scale-95 hover:scale-105 transition-all"
          >
            <Plus size={18} /> New Concept
          </button>
        </div>
      </div>

      {/* Help Overlay */}
      <AnimatePresence>
        {showHelp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowHelp(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="premium-card max-w-md w-full p-10 shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowHelp(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <HelpCircle size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Canvas Guide</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Master the Mind Map</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { icon: Plus, title: "Create Nodes", desc: "Click 'New Concept' or the '+' on any node to branch out." },
                  { icon: MousePointer2, title: "Connect", desc: "Drag from the circle handle on the right to another node." },
                  { icon: Trash2, title: "Interact", desc: "Double-click to edit. Right-click to delete. Drag to move." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-12 h-12 shrink-0 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-bold group-hover:bg-brand-50 group-hover:text-brand-600 transition-all">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 mb-0.5">{item.title}</p>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => setShowHelp(false)}
                className="w-full mt-10 premium-gradient text-white py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-100"
              >
                Got it, let's build!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas Area */}
      <div ref={containerRef} className="flex-1 relative cursor-grab active:cursor-grabbing">
        <Stage 
          width={dimensions.width} 
          height={dimensions.height}
          onWheel={handleWheel}
          scaleX={stageScale}
          scaleY={stageScale}
          x={stagePos.x}
          y={stagePos.y}
          draggable={!linkingFrom}
          onDragEnd={(e) => setStagePos({ x: e.target.x(), y: e.target.y() })}
          onClick={handleStageClick}
          onMouseMove={updateTempLine}
          ref={stageRef}
        >
          <Layer>
            {/* Grid Dots */}
            {Array.from({ length: 30 }).map((_, i) => 
              Array.from({ length: 30 }).map((_, j) => (
                <Circle
                  key={`${i}-${j}`}
                  x={i * 100}
                  y={j * 100}
                  radius={1}
                  fill="#e2e8f0"
                />
              ))
            )}
            
            {/* Render Edges */}
            {edges.map((edge) => {
              const from = nodes.find(n => n.id === edge.from);
              const to = nodes.find(n => n.id === edge.to);
              if (!from || !to) return null;
              
              return (
                <Line
                  key={edge.id}
                  points={[
                    from.x + NODE_WIDTH, from.y + NODE_HEIGHT / 2,
                    from.x + NODE_WIDTH + 50, from.y + NODE_HEIGHT / 2,
                    to.x - 50, to.y + NODE_HEIGHT / 2,
                    to.x, to.y + NODE_HEIGHT / 2
                  ]}
                  stroke="#cbd5e1"
                  strokeWidth={2}
                  lineCap="round"
                  lineJoin="round"
                  tension={0.5}
                />
              );
            })}

            {/* Temp Line during linking */}
            {tempLine && (
              <Line
                points={[
                  tempLine.x1, tempLine.y1,
                  tempLine.x1 + 30, tempLine.y1,
                  tempLine.x2 - 30, tempLine.y2,
                  tempLine.x2, tempLine.y2
                ]}
                stroke="#4f46e5"
                strokeWidth={2}
                dash={[5, 5]}
                tension={0.5}
              />
            )}

            {/* Render Nodes */}
            {nodes.map((node) => (
              <Group
                key={node.id}
                x={node.x}
                y={node.y}
                draggable
                onDragMove={(e) => handleNodeDrag(node.id, e.target.x(), e.target.y())}
                onClick={() => {
                  if (linkingFrom) finishLinking(node.id);
                  else setSelectedId(node.id);
                }}
                onDblClick={() => setEditingId(node.id)}
                onContextMenu={(e) => {
                  e.evt.preventDefault();
                  handleDeleteNode(node.id);
                }}
              >
                <Rect
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  fill={node.color}
                  cornerRadius={12}
                  shadowBlur={selectedId === node.id ? 15 : 5}
                  shadowOpacity={0.1}
                  stroke={selectedId === node.id ? '#000' : 'transparent'}
                  strokeWidth={2}
                />
                
                {editingId === node.id ? (
                  <Group>
                    <Rect 
                      width={NODE_WIDTH} 
                      height={NODE_HEIGHT} 
                      fill="#fff" 
                      cornerRadius={12} 
                      stroke="#4f46e5" 
                      strokeWidth={2} 
                    />
                    <Text
                      text={node.text}
                      fontSize={14}
                      fontFamily="Inter"
                      fontStyle="bold"
                      fill="#18181b"
                      align="center"
                      verticalAlign="middle"
                      width={NODE_WIDTH}
                      height={NODE_HEIGHT}
                      padding={10}
                    />
                  </Group>
                ) : (
                  <Text
                    text={node.text}
                    fontSize={14}
                    fontFamily="Inter"
                    fontStyle="bold"
                    fill="#fff"
                    align="center"
                    verticalAlign="middle"
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    padding={10}
                  />
                )}

                {/* Interaction Handles (only when selected) */}
                {selectedId === node.id && (
                  <Group>
                    {/* Add Child Button */}
                    <Group 
                      x={NODE_WIDTH / 2 - 12} 
                      y={NODE_HEIGHT + 10}
                      onClick={(e) => { e.cancelBubble = true; handleAddNode(node.id); }}
                    >
                      <Circle radius={12} fill="#fff" stroke="#e2e8f0" strokeWidth={1} />
                      <Text text="+" fontSize={16} fontStyle="bold" fill="#4f46e5" x={-5} y={-8} />
                    </Group>

                    {/* Linking Handle */}
                    <Circle
                      x={NODE_WIDTH + 10}
                      y={NODE_HEIGHT / 2}
                      radius={8}
                      fill="#4f46e5"
                      stroke="#fff"
                      strokeWidth={2}
                      onMouseDown={(e) => startLinking(node.id, e)}
                    />

                    {/* Delete Button */}
                    <Group 
                      x={NODE_WIDTH / 2 + 12} 
                      y={NODE_HEIGHT + 10}
                      onClick={(e) => { e.cancelBubble = true; handleDeleteNode(node.id); }}
                    >
                      <Circle radius={12} fill="#fff" stroke="#fee2e2" strokeWidth={1} />
                      <Text text="×" fontSize={20} fontStyle="bold" fill="#ef4444" x={-6} y={-11} />
                    </Group>
                  </Group>
                )}
              </Group>
            ))}
          </Layer>
        </Stage>

        {/* Inline Editor Overlay */}
        {editingId && (
          <div 
            className="absolute z-30" 
            style={{ 
              left: (nodes.find(n => n.id === editingId)!.x * stageScale) + stagePos.x, 
              top: (nodes.find(n => n.id === editingId)!.y * stageScale) + stagePos.y,
              width: NODE_WIDTH * stageScale,
              height: NODE_HEIGHT * stageScale
            }}
          >
            <input
              autoFocus
              className="w-full h-full bg-white border-2 border-brand-500 rounded-xl px-3 font-bold text-zinc-900 shadow-xl outline-none"
              value={nodes.find(n => n.id === editingId)?.text || ''}
              onChange={(e) => setNodes(prev => prev.map(n => n.id === editingId ? { ...n, text: e.target.value } : n))}
              onBlur={() => setEditingId(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
            />
          </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute bottom-8 left-8 flex items-center gap-2 bg-white p-2 rounded-2xl border border-zinc-200 shadow-xl">
          <button 
            onClick={() => setStageScale(s => Math.min(3, s * 1.1))}
            className="p-2 hover:bg-zinc-50 rounded-xl text-zinc-500 transition-all"
          >
            <ZoomIn size={18} />
          </button>
          <div className="text-[10px] font-bold text-zinc-400 w-12 text-center">
            {Math.round(stageScale * 100)}%
          </div>
          <button 
            onClick={() => setStageScale(s => Math.max(0.2, s / 1.1))}
            className="p-2 hover:bg-zinc-50 rounded-xl text-zinc-500 transition-all"
          >
            <ZoomOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
