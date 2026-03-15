/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Subject } from './types';

export const SUBJECTS: Subject[] = ['Math', 'Science', 'History', 'Languages', 'General'];

export const PRIORITIES = ['low', 'medium', 'high'] as const;

export const MASTERY_LEVELS = [0, 1, 2, 3, 4, 5] as const;
