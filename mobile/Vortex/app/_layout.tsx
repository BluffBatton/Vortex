import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Wallet from "./wallet";
import Login from "./login";
import { useAuth } from "@/context/auth/authProvider";
import { Button } from "react-native";

const Stack = createNativeStackNavigator();

export default function Layout() {
  const { authState, onLogout } = useAuth();

  return (
    <Stack.Navigator>
      {authState?.authenticated ? (
        <Stack.Screen
          name="Wallet"
          component={Wallet}
          options={{
            headerRight: () => (
              <Button onPress={onLogout} title="Sign Out" />
            ),
          }}
        />
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
}