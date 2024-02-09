//navigation
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
//basic react
import * as React from 'react';
import 'react-native-gesture-handler';
//merchant
import MerchantSignup from './screens/merchant/MerchantSignup';
import MerchantDetails from './screens/merchant/MerchantDetails';
import MerchantSignin from './screens/merchant/MerchantSignin';
import MerchantHomepage from './screens/merchant/MerchantHomepage';
import MerchantMenu from './screens/merchant/MerchantMenu';
import MerchantEditProfile from './screens/merchant/MerchantEditProfile';
import MerchantTodayPromo from './screens/merchant/MerchantTodayPromo';
import MerchantNavigation from './screens/NavigationBar';
import MerchantProfile from './screens/merchant/MerchantProfile';
import MerchantAddMenu from './screens/merchant/MerchantAddMenu';
import MerchantAppetizer from './screens/merchant/MerchantAppetizer';
import MerchantUserView from './screens/merchant/MerchantUserView';
import MerchantMainCourse from './screens/merchant/MerchantMainCourse';
import MerchantDessert from './screens/merchant/MerchantDessert';
import MerchantOrdersReceived from './screens/merchant/MerchantOrdersReceived';
import MerchantOrdersFinished from './screens/merchant/MerchantOrdersFinished';
import MerchantOrdersOnDelivery from './screens/merchant/MerchantOrdersOnDelivery';
import MerchantOrdersProcessing from './screens/merchant/MerchantOrdersProcessing';
import MerchantOrdersDetail from './screens/merchant/MerchantOrdersDetail';
import MerchantOrderDetailsFinished from './screens/merchant/MerchantOrderDetailsFinished';
//main homepage
import Homepage from './screens/Homepage';

//partner
import PartnerSignin from './screens/partner/PartnerSignin';
import PartnerSignup from './screens/partner/PartnerSignup';
import PartnerHomepage from './screens/partner/PartnerHomepage';
import PartnerProfile from './screens/partner/PartnerProfile';
import PartnerEditProfile from './screens/partner/PartnerEditProfile';
import PartnerSignupDetails from './screens/partner/PartnerSignupDetails';
import PartnerMap from './screens/partner/PartnerMap';

//paper meterial ui
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';

//user
import UserSignin from './screens/user/UserSignin';
import UserSignup from './screens/user/UserSignup';
import UserHomepage from './screens/user/UserHomepage';
import BestSeller from './screens/user/BestSeller';
import RestaurantPage from './screens/user/RestaurantPage';
import UserProfile from './screens/user/UserProfile';
import UserEditProfile from './screens/user/UserEditProfile';
import UserDetails from './screens/user/UserDetails';
import Search from './screens/user/Search';
import Cart from './screens/user/Cart';
import UserWallet from './screens/user/UserWallet';
import UserWalletTopup from './screens/user/UserWalletTopup';
import UserMap from './screens/user/UserMap';
import UserFinishedOrder from './screens/user/UserFinishedOrder';

const Stack = createStackNavigator();

function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          {/* Homepage of entire app */}
          <Stack.Screen
            name="Homepage"
            component={Homepage}
            options={{headerShown: false}}
          />
          {/* merchant stuff */}
          <Stack.Screen
            name="MerchantSignin"
            component={MerchantSignin}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantSignup"
            component={MerchantSignup}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantDetails"
            component={MerchantDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantHomepage"
            component={MerchantHomepage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantMenu"
            component={MerchantMenu}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantProfile"
            component={MerchantProfile}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantEditProfile"
            component={MerchantEditProfile}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantTodayPromo"
            component={MerchantTodayPromo}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantNavigation"
            component={MerchantNavigation}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantAddMenu"
            component={MerchantAddMenu}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantAppetizer"
            component={MerchantAppetizer}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantUserView"
            component={MerchantUserView}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantMainCourse"
            component={MerchantMainCourse}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantDessert"
            component={MerchantDessert}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantOrdersReceived"
            component={MerchantOrdersReceived}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantOrdersFinished"
            component={MerchantOrdersFinished}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantOrdersOnDelivery"
            component={MerchantOrdersOnDelivery}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantOrdersProcessing"
            component={MerchantOrdersProcessing}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantOrdersDetail"
            component={MerchantOrdersDetail}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantOrderDetailsFinished"
            component={MerchantOrderDetailsFinished}
            options={{headerShown: false}}
          />
          {/* Partner */}
          <Stack.Screen
            name="PartnerSignin"
            component={PartnerSignin}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PartnerSignup"
            component={PartnerSignup}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PartnerHomepage"
            component={PartnerHomepage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PartnerProfile"
            component={PartnerProfile}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PartnerEditProfile"
            component={PartnerEditProfile}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PartnerSignupDetails"
            component={PartnerSignupDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PartnerMap"
            component={PartnerMap}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserSignin"
            component={UserSignin}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserSignup"
            component={UserSignup}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserHomepage"
            component={UserHomepage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="BestSeller"
            component={BestSeller}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="RestaurantPage"
            component={RestaurantPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserProfile"
            component={UserProfile}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserEditProfile"
            component={UserEditProfile}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserDetails"
            component={UserDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Search"
            component={Search}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Cart"
            component={Cart}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserWallet"
            component={UserWallet}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserWalletTopup"
            component={UserWalletTopup}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserMap"
            component={UserMap}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserFinishedOrder"
            component={UserFinishedOrder}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const theme = {
  ...DefaultTheme,
  roundness: 40,
  colors: {
    ...DefaultTheme.colors,
    primary: '#A9FDAC',
    accent: '#f1c40f',
  },
};

export default App;
