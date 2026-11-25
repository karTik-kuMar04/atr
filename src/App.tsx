/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorkspaceProvider } from './context/WorkspaceContext';
import { AppShell } from './components/AppShell';

export default function App() {
  return (
    <WorkspaceProvider>
      <AppShell />
    </WorkspaceProvider>
  );
}
