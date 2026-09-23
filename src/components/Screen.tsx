import React, {PropsWithChildren, ReactElement} from 'react';
import {KeyboardAvoidingView, Platform, StatusBar, StyleSheet, View} from 'react-native';
import {Edge, SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native';
import {colors} from '../theme';

interface ScreenProps {
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  edges?: Edge[];
  scroll?: boolean;
  keyboardAvoiding?: boolean;
  contentContainerStyle?: object;
  refreshControl?: ReactElement;
}

export function Screen({
  children,
  backgroundColor = colors.background,
  statusBarStyle = 'dark-content',
  edges = ['bottom'],
  scroll = false,
  keyboardAvoiding = false,
  contentContainerStyle,
  refreshControl,
}: PropsWithChildren<ScreenProps>) {
  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={refreshControl}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentContainerStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.flex, {backgroundColor}]} edges={edges}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  scrollContent: {flexGrow: 1},
});
