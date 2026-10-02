import * as WebBrowser from 'expo-web-browser';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PlantAvatar } from '@/components/plant-sprite';
import { PLANTS, type PlantId } from '@/data/plants';
import { colors, fonts } from '@/theme';

const KINDS = [
  ['water', 'Water', '#6E9AA6'],
  ['light', 'Light', '#E3B66C'],
  ['cold', 'Cold', '#8FA7C9'],
  ['watch', 'Watch for', '#C46E52'],
] as const;

type Props = {
  /** the plants to flip through, one at a time */
  list: PlantId[];
  index: number | null;
  status?: (id: PlantId) => string;
  onIndexChange: (i: number) => void;
  onClose: () => void;
};

export function PlantCard({ list, index, status, onIndexChange, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const open = index != null && list.length > 0;
  const id = open ? list[index] : null;
  const plant = id ? PLANTS[id] : null;
  const step = (d: number) => index != null && onIndexChange((index + d + list.length) % list.length);

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {plant && (
        <View style={StyleSheet.absoluteFill}>
          <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(200)} style={styles.backdrop}>
            <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close plant card" />
          </Animated.View>
          <Animated.View
            entering={SlideInDown.springify().damping(18)}
            exiting={SlideOutDown.duration(220)}
            style={[styles.sheet, { paddingBottom: 18 + insets.bottom }]}
            accessibilityViewIsModal>
            <View style={styles.grab} />
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              <View style={styles.head}>
                <View style={[styles.art, { backgroundColor: plant.tint }]}>
                  <PlantAvatar sprite={plant.sprite} size={64} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name} accessibilityRole="header">
                    {plant.name}
                  </Text>
                  <Text style={styles.status}>{status?.(plant.id) || 'In your greenhouse'}</Text>
                </View>
              </View>

              <View style={styles.now}>
                <Text style={styles.nowLabel}>Right now</Text>
                <Text style={styles.nowText}>{plant.now}</Text>
              </View>

              <View style={styles.cards}>
                {KINDS.map(([key, label, dot]) => (
                  <View key={key} style={styles.card}>
                    <View style={styles.cardLabelRow}>
                      <View style={[styles.dot, { backgroundColor: dot }]} />
                      <Text style={styles.cardLabel}>{label}</Text>
                    </View>
                    <Text style={styles.cardText}>{plant[key]}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.src}>
                From{' '}
                {plant.sources.map((s, i) => (
                  <Text key={s.url}>
                    {i > 0 ? ' and ' : ''}
                    <Text style={styles.link} onPress={() => WebBrowser.openBrowserAsync(s.url)} accessibilityRole="link">
                      {s.label}
                    </Text>
                  </Text>
                ))}
              </Text>

              {list.length > 1 && (
                <View style={styles.nav}>
                  <Pressable style={styles.navBtn} onPress={() => step(-1)} accessibilityLabel="Previous plant">
                    <Text style={styles.navText}>‹ Previous</Text>
                  </Pressable>
                  <Text style={styles.count}>
                    {index! + 1} of {list.length}
                  </Text>
                  <Pressable style={styles.navBtn} onPress={() => step(1)} accessibilityLabel="Next plant">
                    <Text style={styles.navText}>Next ›</Text>
                  </Pressable>
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(25,38,40,0.35)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '86%',
    backgroundColor: colors.paper,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingHorizontal: 18,
  },
  grab: { width: 40, height: 4, borderRadius: 4, backgroundColor: colors.line, alignSelf: 'center', marginBottom: 12 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  art: { width: 76, height: 76, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: fonts.display, fontSize: 24, letterSpacing: 1, color: colors.ink },
  status: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted, marginTop: 4, letterSpacing: 0.4 },
  now: { marginTop: 14, marginBottom: 12, padding: 14, borderRadius: 16, backgroundColor: colors.nowBg },
  nowLabel: { fontFamily: fonts.displayBold, fontSize: 10.5, letterSpacing: 2, textTransform: 'uppercase', color: colors.nowInk, marginBottom: 3 },
  nowText: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 20, color: colors.ink },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: { width: '47%', flexGrow: 1, padding: 12, borderRadius: 14, backgroundColor: colors.sandDeep },
  cardLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  cardLabel: { fontFamily: fonts.displayBold, fontSize: 10.5, letterSpacing: 1.8, textTransform: 'uppercase', color: colors.inkSoft },
  cardText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.inkSoft },
  src: { fontFamily: fonts.body, fontSize: 11.5, color: colors.muted, marginTop: 12 },
  link: { color: colors.sky, textDecorationLine: 'underline' },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  navBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: colors.line },
  navText: { fontFamily: fonts.bodyMedium, fontSize: 13.5, color: colors.ink },
  count: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
});
