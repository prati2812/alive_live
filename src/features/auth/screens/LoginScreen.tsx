import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, TextInput, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { colors } from '../../../core/theme/colors';
import { typography } from '../../../core/theme/typography';
import { strings } from '../../../core/theme/strings';
import { useDispatch } from 'react-redux';
import { setAuthenticated, setLoading } from '../store/authSlice';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAuth, signInWithCredential, GoogleAuthProvider } from '@react-native-firebase/auth';
import { Eye, EyeOff } from 'lucide-react-native';
import { GOOGLE_WEB_CLIENT_ID } from '@env';

const { width } = Dimensions.get('window');

// White mask to create the curved wave over the gradient background
const TopWaveMask = () => (
  <View style={styles.waveMaskContainer}>
    <Svg height={60} width="100%" viewBox={`0 0 ${width} 60`} preserveAspectRatio="none">
      <Path d={`M0,0 L${width},0 L${width},20 C${width * 0.65},80 ${width * 0.35},0 0,30 Z`} fill="#FFFFFF" />
    </Svg>
  </View>
);

export const LoginScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true, // Ensures refresh tokens and reliable ID tokens
    });

    GoogleSignin.signOut().catch(() => { });
  }, []);

  // const handleGoogleLogin = async () => {
  //   try {
  //     dispatch(setLoading(true));
  //     await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  //     const response = await GoogleSignin.signIn();
  //     const idToken = response.data?.idToken;

  //     if (!idToken) {
  //       throw new Error('Google Sign-In failed: ID token is null');
  //     }

  //     const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  //     await auth().signInWithCredential(googleCredential);

  //     dispatch(setAuthenticated({ id: '1', name: 'Google User' }));
  //     navigation.replace('Main');
  //   } catch (error) {
  //     console.error('Google Sign-In Error:', error);
  //   } finally {
  //     dispatch(setLoading(false));
  //   }
  // };

  const handleGoogleLogin = async () => {
    try {
      dispatch(setLoading(true));
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // 1. Capture the raw payload response from the physical device
      const response = await GoogleSignin.signIn();

      // 3. Fallback extraction method checking all possible SDK versions
      const idToken = response?.data?.idToken;

      if (!idToken) {
        throw new Error(`Token extraction failed. Check the structure printed in your terminal console above.`);
      }

      // 4. Fetch the accessToken to bypass the RNFB v25 empty string bug
      const { accessToken } = await GoogleSignin.getTokens();

      const auth = getAuth();
      const googleCredential = GoogleAuthProvider.credential(idToken, accessToken);
      await signInWithCredential(auth, googleCredential);

      dispatch(setAuthenticated({ id: '1', name: 'Google User' }));
      navigation.replace('Main');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{}} bounces={false} showsVerticalScrollIndicator={false}>

          <View style={styles.topContent}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/images/logo_1.png')}
                style={styles.logo}
              />
            </View>

            {/* Welcome Text */}
            <View style={styles.welcomeContainer}>
              <Text style={[typography.h2, styles.welcomeTitle]}>{strings.login.welcome}</Text>
              <Text style={[typography.body, styles.welcomeSubtitle]}>
                {strings.login.subtitle}
              </Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              <Text style={styles.label}>{strings.login.emailLabel}</Text>
              <TextInput
                style={styles.input}
                placeholder={strings.login.emailPlaceholder}
                placeholderTextColor={colors.grayPlaceholder}
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.label}>{strings.login.passwordLabel}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={strings.login.passwordPlaceholder}
                  placeholderTextColor={colors.grayPlaceholder}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  {showPassword ? <Eye size={20} color={colors.grayPlaceholder} /> : <EyeOff size={20} color={colors.grayPlaceholder} />}
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>{strings.login.forgotPassword}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { }}>
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButton}
                >
                  <Text style={styles.loginButtonText}>{strings.login.loginButton}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Section with Gradient and Wave */}
          <View style={styles.bottomSectionWrapper}>
            <LinearGradient
              colors={[colors.secondaryGradientStart, colors.secondaryGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bottomGradient}
            >
              <TopWaveMask />

              <View style={styles.bottomContent}>
                {/* Divider */}
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>{strings.login.orContinue}</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Google Login Button */}
                <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                  <View style={styles.socialIconWrapper}>
                    <Image source={require('../../../assets/images/google.png')} style={styles.socialIcon} />
                  </View>
                  <Text style={styles.socialButtonText}>{strings.login.googleButton}</Text>
                </TouchableOpacity>

                {/* Facebook Login Button */}
                <TouchableOpacity style={styles.socialButton} onPress={() => { }}>
                  <View style={styles.socialIconWrapper}>
                    <Image source={require('../../../assets/images/facebook.png')} style={styles.socialIcon} />
                  </View>
                  <Text style={styles.socialButtonText}>{strings.login.facebookButton}</Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>{strings.login.signUpPrompt}</Text>
                  <TouchableOpacity>
                    <Text style={styles.signupLink}>{strings.login.signUpLink}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  topContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: colors.background,
  },
  logoContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    color: colors.black,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  formContainer: {
    marginTop: 24,
  },
  label: {
    color: colors.textMuted,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.grayBackground,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 14,
    color: colors.black,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.grayBackground,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.black,
  },
  eyeIcon: {
    padding: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  loginButton: {
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSectionWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    minHeight: Dimensions.get('window').height * 0.39,
  },
  bottomGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  waveMaskContainer: {
    width: '100%',
    position: 'absolute',
    top: -1,
    left: 0,
    right: 0,
  },
  bottomContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 50,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.whiteTransparent,
  },
  dividerText: {
    color: colors.white,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButton: {
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingVertical: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  socialButtonText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
    marginRight: 40,
  },
  socialIconWrapper: {
    marginHorizontal: 12,
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signupText: {
    color: colors.white,
    fontSize: 14,
  },
  signupLink: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginLeft: 4,
  },
});
