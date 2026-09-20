import React from "react";
import { View, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { spacing, WEB_SIDEBAR_WIDTH } from "../utils/theme";
import { CertProvider } from "../context/CertContext";
import { SpeechProvider } from "../context/SpeechContext";
import { AbbreviationTooltipProvider } from "../components/AbbreviatedText";
import { useTheme } from "../context/ThemeContext";
import { useBreakpoint } from "../hooks/useBreakpoint";
import WebSidebar from "../components/WebSidebar";

import CertSelectScreen from "../screens/CertSelectScreen";
import HomeScreen from "../screens/HomeScreen";
import StudyScreen from "../screens/StudyScreen";
import FlashCardScreen from "../screens/FlashCardScreen";
import QuizMenuScreen from "../screens/QuizMenuScreen";
import QuizScreen from "../screens/QuizScreen";
import QuizResultScreen from "../screens/QuizResultScreen";
import ProgressScreen from "../screens/ProgressScreen";
import GuideListScreen from "../screens/GuideListScreen";
import GuideDetailScreen from "../screens/GuideDetailScreen";
import MissedQuestionsScreen from "../screens/MissedQuestionsScreen";
import SourcesScreen from "../screens/SourcesScreen";
import SettingsScreen from "../screens/SettingsScreen";

export type RootStackParamList = {
  CertSelect: undefined;
  Tabs: undefined;
  FlashCard: { domain: string; difficulty: string; service?: string };
  Quiz: { domain: string; difficulty: string; count: number; service?: string };
  QuizResult: { sessionId: string };
  GuideDetail: { id: string };
  MissedQuestions: { source: "guide" | "quiz" };
  Sources: undefined;
  Settings: undefined;
};

export type TabParamList = {
  Home: undefined;
  Study: undefined;
  Guides: undefined;
  QuizMenu: undefined;
  Progress: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabNavigator() {
  const { colors } = useTheme();
  const { isDesktop } = useBreakpoint();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: isDesktop
          ? { display: "none" }
          : {
              backgroundColor: colors.secondary,
              borderTopColor: colors.border,
              borderTopWidth: 1,
              height: 80,
              paddingBottom: 16,
              paddingTop: 8,
            },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, { active: string; inactive: string }> = {
            Home: { active: "home", inactive: "home-outline" },
            Study: { active: "book", inactive: "book-outline" },
            Guides: { active: "library", inactive: "library-outline" },
            QuizMenu: { active: "trophy", inactive: "trophy-outline" },
            Progress: { active: "bar-chart", inactive: "bar-chart-outline" },
          };
          const name = icons[route.name];
          return (
            <Ionicons
              name={(focused ? name.active : name.inactive) as any}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Dashboard" }}
      />
      <Tab.Screen
        name="Study"
        component={StudyScreen}
        options={{ title: "Study" }}
      />
      <Tab.Screen
        name="Guides"
        component={GuideListScreen}
        options={{ title: "Guides" }}
      />
      <Tab.Screen
        name="QuizMenu"
        component={QuizMenuScreen}
        options={{ title: "Quiz" }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ title: "Progress" }}
      />
    </Tab.Navigator>
  );
}

function WebLayout({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        backgroundColor: colors.background,
      }}
    >
      <WebSidebar />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

function RootNavigator() {
  const { isDesktop } = useBreakpoint();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CertSelect" component={CertSelectScreen} />
      <Stack.Screen name="Tabs">
        {() =>
          isDesktop ? (
            <WebLayout>
              <TabNavigator />
            </WebLayout>
          ) : (
            <TabNavigator />
          )
        }
      </Stack.Screen>
      <Stack.Screen name="FlashCard">
        {(props) =>
          isDesktop ? (
            <WebLayout>
              <FlashCardScreen {...(props as any)} />
            </WebLayout>
          ) : (
            <FlashCardScreen {...(props as any)} />
          )
        }
      </Stack.Screen>
      <Stack.Screen name="Quiz">
        {(props) =>
          isDesktop ? (
            <WebLayout>
              <QuizScreen {...(props as any)} />
            </WebLayout>
          ) : (
            <QuizScreen {...(props as any)} />
          )
        }
      </Stack.Screen>
      <Stack.Screen name="QuizResult">
        {(props) =>
          isDesktop ? (
            <WebLayout>
              <QuizResultScreen {...(props as any)} />
            </WebLayout>
          ) : (
            <QuizResultScreen {...(props as any)} />
          )
        }
      </Stack.Screen>
      <Stack.Screen name="GuideDetail">
        {(props) =>
          isDesktop ? (
            <WebLayout>
              <GuideDetailScreen {...(props as any)} />
            </WebLayout>
          ) : (
            <GuideDetailScreen {...(props as any)} />
          )
        }
      </Stack.Screen>
      <Stack.Screen name="MissedQuestions">
        {(props) =>
          isDesktop ? (
            <WebLayout>
              <MissedQuestionsScreen {...(props as any)} />
            </WebLayout>
          ) : (
            <MissedQuestionsScreen {...(props as any)} />
          )
        }
      </Stack.Screen>
      <Stack.Screen name="Sources">
        {(props) =>
          isDesktop ? (
            <WebLayout>
              <SourcesScreen {...(props as any)} />
            </WebLayout>
          ) : (
            <SourcesScreen {...(props as any)} />
          )
        }
      </Stack.Screen>
      <Stack.Screen name="Settings">
        {(props) =>
          isDesktop ? (
            <WebLayout>
              <SettingsScreen {...(props as any)} />
            </WebLayout>
          ) : (
            <SettingsScreen {...(props as any)} />
          )
        }
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <CertProvider>
      <SpeechProvider>
        <AbbreviationTooltipProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AbbreviationTooltipProvider>
      </SpeechProvider>
    </CertProvider>
  );
}
