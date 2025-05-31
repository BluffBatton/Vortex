import React from 'react'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from 'react-router-dom'
import ScrollToTop from './ScrollToTop.jsx'

import Header from './Components/Header/Header.jsx'
import Footer from './Components/Footer/Footer.jsx'

import Main from './Pages/Main/Main.jsx'
import AboutUs from './Pages/AboutUs/AboutUs.jsx'
import Cafe from './Pages/Cafe/Cafe.jsx'
import Fuel from './Pages/Fuel/Fuel.jsx'
import Map from './Pages/Location/Map/Map.jsx'
import List from './Pages/Location/List/List.jsx'
import Authorization from './Pages/Authentication/Authorization/Authorization.jsx'
import LogIn from './Pages/Authentication/LogIn/LogIn.jsx'
import SignUp from './Pages/Authentication/SignUp/SignUp.jsx'

import Profile from './Pages/Profile/Profile.jsx'

import ModeratorPage from './Pages/Moderator/Moderator.jsx'
import Administrator from './Pages/Administrator/Administrator.jsx'

const AppContent = () => {
	const location = useLocation()
	const hideHeaderFooter = ['/Administrator', '/ModeratorPage'].includes(
		location.pathname
	)

	return (
		<>
			<ScrollToTop />
			{!hideHeaderFooter && <Header />}
			<Routes>
				<Route path='/Main' element={<Main />} />
				<Route path='/AboutUs' element={<AboutUs />} />
				<Route path='/Cafe' element={<Cafe />} />
				<Route path='/Fuel' element={<Fuel />} />
				<Route path='/Map' element={<Map />} />
				<Route path='/List' element={<List />} />
				<Route path='/' element={<Authorization />} />
				<Route path='/LogIn' element={<LogIn />} />
				<Route path='/SignUp' element={<SignUp />} />
				<Route path='/Profile' element={<Profile />} />
				<Route path='/ModeratorPage' element={<ModeratorPage />} />
				<Route path='/Administrator' element={<Administrator />} />
			</Routes>
			{!hideHeaderFooter && <Footer />}
		</>
	)
}

const App = () => (
	<Router>
		<AppContent />
	</Router>
)

export default App
