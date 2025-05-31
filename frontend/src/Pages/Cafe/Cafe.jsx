import React from 'react'
import './Cafe.css'

import { Burger, Coffee, Donut, HotDog } from '../../Assets/Assets.js'

const Cafe = () => {
	return (
		<main class='cafe-main'>
			<div class='cafe-intro'>
				<h1 class='cafe-title'>Cafe</h1>
				<p class='cafe-subtitle'>
					Enjoy our some exclusive food, which available only at our Gas
					Stations
				</p>
			</div>

			<div class='cafe-items'>
				<div class='cafe-item'>
					<img
						src={Burger}
						alt='Burger'
						class='cafe-item__img cafe-item__img--left'
					/>
					<div class='cafe-item__content'>
						<h2 class='cafe-item__title'>Burger "Meat Craft"</h2>
						<p class='cafe-item__description'>
							"An explosion of flavor for true fans of powerful bites! Dive into
							the ultimate burger experience where every ingredient tells a
							story. Our juicy, hand-pressed beef patty is grilled to smoky
							perfection over an open flame, locking in rich, meaty juices with
							a tantalizing charred crust. Crispy applewood-smoked bacon adds a
							salty crunch, while layers of melted aged cheddar ooze decadently
							with every bite. Slow-caramelized onions, golden and sweet, mingle
							with fresh garden veggies — crisp lettuce, ripe tomato slices, and
							crunchy pickles for brightness.
						</p>
					</div>
				</div>

				<div class='cafe-item cafe-item--reverse'>
					<img
						src={Donut}
						alt='Donuts'
						class='cafe-item__img cafe-item__img--right'
					/>
					<div class='cafe-item__content'>
						<h2 class='cafe-item__title_left'>Donuts</h2>
						<p class='cafe-item__description_left'>
							"This isn’t just dessert — it’s flavorful firepower that hits you
							with energy from the very first bite. Imagine sinking your teeth
							into a cloud of perfectly aerated dough, fried to a golden halo of
							crispness that shatters delicately under pressure. Inside,
							generous fillings erupt like a flavor grenade — silky vanilla
							custard, molten dark chocolate that cascades luxuriously, or tangy
							berry compote bursting with sun-ripened intensity. The crunchy
							glaze isn’t just a topping; it’s a sugar-armored shell that cracks
							open to reveal layers of texture. Rainbow sprinkles pop like
							confetti, while crushed pistachios or caramelized bacon bits add a
							rebellious salty-sweet punch. These donuts don’t whisper — they
							scream indulgence with every bite.
						</p>
					</div>
				</div>

				<div class='cafe-item'>
					<img
						src={Coffee}
						alt='Coffee'
						class='cafe-item__img cafe-item__img--left'
					/>
					<div class='cafe-item__content'>
						<h2 class='cafe-item__title'>Powerful Coffee</h2>
						<p class='cafe-item__description'>
							"Coffee – aromatic espresso, smooth latte, or invigorating
							Americano. But for us, it’s never just a drink—it’s a ritual
							crafted from obsession. Each batch is freshly roasted in-house to
							unlock notes of dark chocolate, caramelized nuts, or citrusy
							brightness—tailored to your mood. Espresso? A concentrated flame
							of flavor—velvety crema crowning a shot so intense it vibrates on
							your tongue. Latte? A silky-smooth ballet of double-shot espresso
							and steamed organic milk, poured to a honey-like consistency that
							hugs your senses. Americano? A bold yet crystal-clean reboot,
							where hot water amplifies the beans’ earthy richness without
							dilution.
						</p>
					</div>
				</div>

				<div class='cafe-item cafe-item--reverse'>
					<img
						src={HotDog}
						alt='Hot Dog'
						class='cafe-item__img cafe-item__img--right'
					/>
					<div class='cafe-item__content'>
						<h2 class='cafe-item__title_left'>Hot Dog "Meat Machine"</h2>
						<p class='cafe-item__description_left'>
							"Flavor that hits like full throttle! This isn’t just a hot
							dog—it’s a high-octane flavor missile engineered for maximum
							impact. At its core: a juicy XXL sausage, fire-grilled until its
							casing snaps with audacious crunch, revealing a perfectly spiced,
							smoky interior that oozes savory juices with every bite. Nestled
							in a pillowy-soft artisan bun—lightly toasted for a golden,
							buttery crispness that holds up to the chaos—it’s layered. This
							hot dog doesn’t just kill hunger—it charges you like a turbo
							boost. It’s loud, messy, and unapologetic—like a flavor festival
							in your mouth. One bite and there’s no stopping. The afterburn? A
							lingering heat, a satisfied grin, and fingers too sticky to care.
							This isn’t food—it’s a dare.
						</p>
					</div>
				</div>
			</div>
		</main>
	)
}

export default Cafe
