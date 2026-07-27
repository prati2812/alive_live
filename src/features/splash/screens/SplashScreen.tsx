import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../../../core/theme/colors';
import { useDispatch } from 'react-redux';
import { setAuthenticated } from '../../auth/store/authSlice';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';

// @ts-ignore - navigation type will be added later
export const SplashScreen = ({ navigation }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Add a small delay so the splash animation has time to play
      setTimeout(() => {
        if (user) {
          // If logged in, dispatch to Redux and go to Main
          dispatch(setAuthenticated({ id: user.uid, name: user.displayName || 'User' }));
          navigation.replace('Main');
        } else {
          // If not logged in, go to Login screen
          navigation.replace('Login');
        }
      }, 2000);
    });

    return () => unsubscribe();
  }, [navigation, dispatch, scaleValue, opacityValue]);

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={require('../../../assets/images/logo_1.png')}
        style={[
          styles.logo,
          {
            opacity: opacityValue,
            transform: [{ scale: scaleValue }]
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  }
});
