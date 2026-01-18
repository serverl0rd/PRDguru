import AuthGate from '../../components/auth/AuthGate';
import ThreePanelLayout from '../../components/app/ThreePanelLayout';
import { PRDProvider } from '../../context/PRDContext';

export default function AppPage() {
  return (
    <AuthGate>
      <PRDProvider>
        <ThreePanelLayout />
      </PRDProvider>
    </AuthGate>
  );
}
