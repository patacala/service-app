import { ScreenWrapper } from '@/design-system/layout/ScreenWrapper';
import { ProfileScreen } from '@/features/profile';

export default function ProfilePage() {
  return (
    <ScreenWrapper showRating={true} rating={4.2}>
      <ProfileScreen />
    </ScreenWrapper>
  );
}