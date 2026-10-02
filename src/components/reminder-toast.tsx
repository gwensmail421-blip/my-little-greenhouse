import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated';

import { PlantAvatar } from '@/components/plant-sprite';
import type { PlantId } from '@/data/plants';
import type { Reminder } from '@/lib/reminders';
import { colors, fonts } from '@/theme';

type Props = {
  reminder: Reminder;
  top: number;
  onPlantPress: (id: PlantId) => void;
  onDone: () => void;
  onLater: () => void;
};

/** One pop-up for everything that needs the same job today. */
export function ReminderToast({ reminder, top, onPlantPress, onDone, onLater }: Props) {
  return (
    <Animated.View
      entering={SlideInUp.springify().damping(16).delay(700)}
      exiting={SlideOutUp.duration(260)}
      style={[styles.toast, { top }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite">
      <Text style={styles.eyebrow}>{reminder.eyebrow}</Text>
      <Text style={styles.title}>{reminder.title}</Text>
      <Text style={styles.body}>{reminder.body}</Text>
      <View style={styles.avatars}>
        {reminder.plants.map((p) => (
          <Pressable key={p.id} style={styles.avatar} onPress={() => onPlantPress(p.id)} accessibilityLabel={`Open ${p.name}`}>
            <PlantAvatar sprite={p.sprite} />
            <Text style={styles.avatarName} numberOfLines={1}>
              {p.shortName}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.actions}>
        <Pressable style={[styles.btn, styles.primary]} onPress={onDone}>
          <Text style={[styles.btnText, { color: colors.paper }]}>Done</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={onLater}>
          <Text style={styles.btnText}>Remind me later</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: 'rgba(250,247,242,0.97)',
    borderRadius: 20,
    padding: 14,
    paddingBottom: 12,
    boxShadow: '0 18px 40px -18px rgba(20,40,40,0.55)',
  },
  eyebrow: { fontFamily: fonts.displayBold, fontSize: 10.5, letterSpacing: 2, textTransform: 'uppercase', color: colors.sky },
  title: { fontFamily: fonts.display, fontSize: 18, color: colors.ink, marginTop: 2, marginBottom: 4 },
  body: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 19, color: '#3D4F54', marginBottom: 10 },
  avatars: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  avatar: { width: 64, alignItems: 'center', gap: 3, paddingTop: 6, paddingBottom: 5, borderRadius: 14, backgroundColor: colors.sandDeep },
  avatarName: { fontFamily: fonts.body, fontSize: 11.5, color: colors.inkSoft },
  actions: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 999, borderWidth: 1, borderColor: colors.line },
  primary: { backgroundColor: colors.pine, borderColor: colors.pine },
  btnText: { fontFamily: fonts.bodyMedium, fontSize: 13.5, color: colors.ink },
});
