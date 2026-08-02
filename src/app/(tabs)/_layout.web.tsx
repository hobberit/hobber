import { Tabs, TabList, TabTrigger, TabSlot, TabTriggerSlotProps } from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, View, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

const TAB_ICONS: Record<string, { ios: string; android: string; web: string }> = {
  home: { ios: 'house', android: 'home', web: 'home' },
  explore: { ios: 'safari', android: 'explore', web: 'explore' },
  tracker: { ios: 'square.grid.2x2', android: 'grid_view', web: 'grid_view' },
  profile: { ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' },
};

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <View style={styles.tabBar}>
          <TabTrigger name="home" href="/" asChild>
            <TabButton icon={TAB_ICONS.home} label="Home" />
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton icon={TAB_ICONS.explore} label="Explore" />
          </TabTrigger>
          <TabTrigger name="tracker" href="/tracker" asChild>
            <TabButton icon={TAB_ICONS.tracker} label="My Hobbies" />
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <TabButton icon={TAB_ICONS.profile} label="Profile" />
          </TabTrigger>
        </View>
      </TabList>
    </Tabs>
  );
}

function TabButton({
  icon,
  label,
  isFocused,
  ...props
}: TabTriggerSlotProps & { icon: { ios: string; android: string; web: string }; label: string }) {
  const tint = isFocused ? '#000000' : '#B0B3B8';
  return (
    <Pressable {...props} style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <SymbolView name={icon as never} size={22} tintColor={tint} />
      <ThemedText type="small" style={[styles.label, { color: tint, fontWeight: isFocused ? '700' : '500' }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
  },
  pressed: {
    opacity: 0.7,
  },
});
