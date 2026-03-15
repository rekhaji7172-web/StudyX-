/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Flashcards from './pages/Flashcards';
import Timer from './pages/Timer';
import Tasks from './pages/Tasks';
import MindMap from './pages/MindMap';
import StudyPlanner from './pages/StudyPlanner';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/mindmap" element={<MindMap />} />
          <Route path="/mindmap/:id" element={<MindMap />} />
          <Route path="/planner" element={<StudyPlanner />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}
