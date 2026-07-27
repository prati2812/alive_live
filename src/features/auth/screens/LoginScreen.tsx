import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, TextInput, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { colors } from '../../../core/theme/colors';
import { typography } from '../../../core/theme/typography';
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

      // 2. CRITICAL DEBUGGER: Print this out to your terminal console
      console.log('--- RAW PAYLOAD RECEIVED FROM DEVICE ---');
      console.log(JSON.stringify(response, null, 2));
      console.log('----------------------------------------');

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
              <Text style={[typography.h2, styles.welcomeTitle]}>Welcome back! 👋</Text>
              <Text style={[typography.body, styles.welcomeSubtitle]}>
                Sign in to continue your live streaming{'\n'}journey.
              </Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              <Text style={styles.label}>Email ID or Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Registered Email or Phone No."
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  {showPassword ? <Eye size={20} color="#999" /> : <EyeOff size={20} color="#999" />}
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { }}>
                <LinearGradient
                  colors={['#C6FF00', '#00E676']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButton}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Section with Gradient and Wave */}
          <View style={styles.bottomSectionWrapper}>
            <LinearGradient
              colors={['#38E54D', '#1B5E20']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bottomGradient}
            >
              <TopWaveMask />

              <View style={styles.bottomContent}>
                {/* Divider */}
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or continue with</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Google Login Button */}
                <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                  <View style={styles.socialIconWrapper}>
                    <Image source={require('../../../assets/images/google.png')} style={styles.socialIcon} />
                  </View>
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                {/* Facebook Login Button */}
                <TouchableOpacity style={styles.socialButton} onPress={() => { }}>
                  <View style={styles.socialIconWrapper}>
                    <Image source={require('../../../assets/images/facebook.png')} style={styles.socialIcon} />
                  </View>
                  <Text style={styles.socialButtonText}>Continue with Facebook</Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>Don't have an account? </Text>
                  <TouchableOpacity>
                    <Text style={styles.signupLink}>Sign Up</Text>
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
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
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: 10,
  },
  label: {
    color: '#666666',
    marginBottom: 8,
    fontSize: 13,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 14,
    color: '#000000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#000000',
  },
  eyeIcon: {
    padding: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#388E3C',
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
    color: '#FFFFFF',
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dividerText: {
    color: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  socialButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  socialIconWrapper: {
    marginRight: 12,
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
    color: '#FFFFFF',
    fontSize: 14,
  },
  signupLink: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
