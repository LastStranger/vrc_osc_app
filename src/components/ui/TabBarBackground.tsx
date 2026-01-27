// This is a shim for web and Android where the tab bar is generally opaque.
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabBarBackground() {
  return (
      <LinearGradient
          colors={['#A3C8FF', '#E0E4FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
      />
  );
}
//
// export function useBottomTabOverflow() {
//   return 0;
// }
