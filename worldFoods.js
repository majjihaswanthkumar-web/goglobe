// Curated dishes from around the world.
// type: "Street food" | "Main" | "Dessert" | "Drink"
export const WORLD_FOODS = [
  // Asia
  { name: "Butter Chicken", country: "India", continent: "Asia", type: "Main", veg: false, description: "Tandoor-charred chicken simmered in a silky tomato, butter and cream gravy.", ingredients: "Chicken, tomato, butter, cream" },
  { name: "Masala Dosa", country: "India", continent: "Asia", type: "Street food", veg: true, description: "Crisp fermented rice crepe wrapped around spiced potato, with coconut chutney.", ingredients: "Rice, urad dal, potato, curry leaves" },
  { name: "Hyderabadi Biryani", country: "India", continent: "Asia", type: "Main", veg: false, description: "Sealed pot of basmati rice layered with marinated meat, saffron and fried onion.", ingredients: "Rice, mutton, saffron, yogurt" },
  { name: "Ramen", country: "Japan", continent: "Asia", type: "Main", veg: false, description: "Wheat noodles in a deep pork or soy broth with soft egg and scallion.", ingredients: "Noodles, pork, egg, miso" },
  { name: "Sushi", country: "Japan", continent: "Asia", type: "Main", veg: false, description: "Vinegared rice paired with raw fish, seafood or vegetables, eaten by hand.", ingredients: "Rice, fish, nori, rice vinegar" },
  { name: "Okonomiyaki", country: "Japan", continent: "Asia", type: "Street food", veg: false, description: "Savoury cabbage pancake griddled at the table and finished with bonito flakes.", ingredients: "Cabbage, flour, egg, pork" },
  { name: "Pad Thai", country: "Thailand", continent: "Asia", type: "Street food", veg: false, description: "Rice noodles tossed with tamarind, egg, peanuts and a squeeze of lime.", ingredients: "Rice noodles, tamarind, egg, peanuts" },
  { name: "Green Curry", country: "Thailand", continent: "Asia", type: "Main", veg: false, description: "Coconut curry fragrant with green chilli, Thai basil and small aubergines.", ingredients: "Coconut milk, green chilli, basil, chicken" },
  { name: "Pho", country: "Vietnam", continent: "Asia", type: "Main", veg: false, description: "Broth simmered for hours with star anise, poured over rice noodles and herbs.", ingredients: "Rice noodles, beef, star anise, herbs" },
  { name: "Banh Mi", country: "Vietnam", continent: "Asia", type: "Street food", veg: false, description: "Crusty baguette stuffed with pate, pork, pickled carrot and coriander.", ingredients: "Baguette, pork, pate, pickles" },
  { name: "Peking Duck", country: "China", continent: "Asia", type: "Main", veg: false, description: "Lacquered roast duck carved at the table and rolled in thin pancakes.", ingredients: "Duck, maltose, spring onion, pancakes" },
  { name: "Xiaolongbao", country: "China", continent: "Asia", type: "Street food", veg: false, description: "Steamed dumplings holding a mouthful of hot pork soup inside.", ingredients: "Flour, pork, ginger, broth" },
  { name: "Bibimbap", country: "South Korea", continent: "Asia", type: "Main", veg: false, description: "Rice bowl arranged with vegetables, beef, egg and chilli paste to mix.", ingredients: "Rice, beef, egg, gochujang" },
  { name: "Kimchi", country: "South Korea", continent: "Asia", type: "Street food", veg: true, description: "Fermented napa cabbage sharp with chilli, garlic and ginger.", ingredients: "Cabbage, chilli, garlic, ginger" },
  { name: "Nasi Goreng", country: "Indonesia", continent: "Asia", type: "Main", veg: false, description: "Wok-fried rice sweetened with kecap manis and topped with a fried egg.", ingredients: "Rice, kecap manis, shallot, egg" },
  { name: "Satay", country: "Indonesia", continent: "Asia", type: "Street food", veg: false, description: "Charcoal-grilled skewers served with a thick, chunky peanut sauce.", ingredients: "Chicken, peanuts, turmeric, coconut" },
  { name: "Laksa", country: "Malaysia", continent: "Asia", type: "Main", veg: false, description: "Spicy coconut noodle soup with prawns, tofu puffs and fresh mint.", ingredients: "Rice noodles, coconut, prawns, laksa leaf" },

  // Europe
  { name: "Pizza Margherita", country: "Italy", continent: "Europe", type: "Main", veg: true, description: "Naples' blistered flatbread with tomato, mozzarella and torn basil.", ingredients: "Dough, tomato, mozzarella, basil" },
  { name: "Pasta Carbonara", country: "Italy", continent: "Europe", type: "Main", veg: false, description: "Roman pasta bound in egg and pecorino with crisp cured pork.", ingredients: "Spaghetti, egg, pecorino, guanciale" },
  { name: "Gelato", country: "Italy", continent: "Europe", type: "Dessert", veg: true, description: "Dense, slow-churned ice cream eaten on a evening walk.", ingredients: "Milk, sugar, cream, fruit" },
  { name: "Croissant", country: "France", continent: "Europe", type: "Dessert", veg: true, description: "Laminated butter pastry with a shattering crust and honeycombed crumb.", ingredients: "Flour, butter, yeast, milk" },
  { name: "Ratatouille", country: "France", continent: "Europe", type: "Main", veg: true, description: "Provencal stew of aubergine, courgette, pepper and ripe tomato.", ingredients: "Aubergine, courgette, pepper, tomato" },
  { name: "Paella", country: "Spain", continent: "Europe", type: "Main", veg: false, description: "Saffron rice cooked wide and shallow with seafood and a crisp base.", ingredients: "Rice, saffron, prawns, mussels" },
  { name: "Churros", country: "Spain", continent: "Europe", type: "Dessert", veg: true, description: "Ridged fried dough dusted in sugar and dipped in thick chocolate.", ingredients: "Flour, sugar, cinnamon, chocolate" },
  { name: "Moussaka", country: "Greece", continent: "Europe", type: "Main", veg: false, description: "Baked layers of aubergine, spiced lamb and golden bechamel.", ingredients: "Aubergine, lamb, bechamel, tomato" },
  { name: "Souvlaki", country: "Greece", continent: "Europe", type: "Street food", veg: false, description: "Grilled pork skewers wrapped in warm pita with tzatziki and onion.", ingredients: "Pork, pita, yogurt, onion" },
  { name: "Bratwurst", country: "Germany", continent: "Europe", type: "Street food", veg: false, description: "Grilled sausage in a crusty roll, eaten with a smear of mustard.", ingredients: "Pork, spices, bread roll, mustard" },
  { name: "Fish and Chips", country: "United Kingdom", continent: "Europe", type: "Main", veg: false, description: "Beer-battered fish with thick-cut chips and malt vinegar.", ingredients: "Cod, flour, potato, vinegar" },
  { name: "Pastel de Nata", country: "Portugal", continent: "Europe", type: "Dessert", veg: true, description: "Blistered custard tart from Lisbon, dusted with cinnamon.", ingredients: "Pastry, egg yolk, cream, cinnamon" },
  { name: "Pierogi", country: "Poland", continent: "Europe", type: "Main", veg: true, description: "Pan-fried dumplings filled with potato, cheese or sauerkraut.", ingredients: "Flour, potato, cheese, onion" },
  { name: "Kanelbulle", country: "Sweden", continent: "Europe", type: "Dessert", veg: true, description: "Cardamom-scented cinnamon bun, the heart of the Swedish fika break.", ingredients: "Flour, butter, cinnamon, cardamom" },

  // North America
  { name: "Cheeseburger", country: "United States", continent: "North America", type: "Street food", veg: false, description: "Griddled beef patty with melting cheese in a soft toasted bun.", ingredients: "Beef, cheddar, bun, pickles" },
  { name: "New York Cheesecake", country: "United States", continent: "North America", type: "Dessert", veg: true, description: "Dense baked cream cheese cake on a buttery biscuit base.", ingredients: "Cream cheese, eggs, sugar, biscuit" },
  { name: "Smoked Brisket", country: "United States", continent: "North America", type: "Main", veg: false, description: "Beef brisket smoked low for hours until it slices like butter.", ingredients: "Beef, salt, pepper, oak smoke" },
  { name: "Tacos al Pastor", country: "Mexico", continent: "North America", type: "Street food", veg: false, description: "Spit-roasted pork with pineapple piled onto soft corn tortillas.", ingredients: "Pork, pineapple, chilli, corn tortilla" },
  { name: "Mole Poblano", country: "Mexico", continent: "North America", type: "Main", veg: false, description: "Dark sauce of chillies, chocolate and nuts spooned over turkey.", ingredients: "Chilli, chocolate, nuts, turkey" },
  { name: "Guacamole", country: "Mexico", continent: "North America", type: "Street food", veg: true, description: "Mashed avocado with lime, coriander and green chilli, scooped with chips.", ingredients: "Avocado, lime, coriander, chilli" },
  { name: "Poutine", country: "Canada", continent: "North America", type: "Street food", veg: false, description: "Hot fries buried under squeaky cheese curds and rich gravy.", ingredients: "Potato, cheese curds, gravy" },
  { name: "Butter Tart", country: "Canada", continent: "North America", type: "Dessert", veg: true, description: "Flaky pastry cup filled with a runny butter and sugar centre.", ingredients: "Pastry, butter, sugar, egg" },
  { name: "Jerk Chicken", country: "Jamaica", continent: "North America", type: "Main", veg: false, description: "Scotch bonnet-marinated chicken grilled over pimento wood.", ingredients: "Chicken, scotch bonnet, allspice, thyme" },
  { name: "Cuban Sandwich", country: "Cuba", continent: "North America", type: "Street food", veg: false, description: "Pressed loaf of roast pork, ham, pickles and mustard.", ingredients: "Bread, pork, ham, cheese" },

  // South America
  { name: "Feijoada", country: "Brazil", continent: "South America", type: "Main", veg: false, description: "Black bean and pork stew served with rice, farofa and orange.", ingredients: "Black beans, pork, rice, orange" },
  { name: "Brigadeiro", country: "Brazil", continent: "South America", type: "Dessert", veg: true, description: "Chocolate fudge ball rolled in sprinkles, at every celebration.", ingredients: "Condensed milk, cocoa, butter, sprinkles" },
  { name: "Pao de Queijo", country: "Brazil", continent: "South America", type: "Street food", veg: true, description: "Chewy cheese bread puffs made with cassava starch.", ingredients: "Cassava starch, cheese, egg, milk" },
  { name: "Ceviche", country: "Peru", continent: "South America", type: "Street food", veg: false, description: "Raw fish cured in lime juice with red onion and ají chilli.", ingredients: "Fish, lime, onion, chilli" },
  { name: "Lomo Saltado", country: "Peru", continent: "South America", type: "Main", veg: false, description: "Stir-fried beef with onion and tomato over chips and rice.", ingredients: "Beef, onion, tomato, potato" },
  { name: "Asado", country: "Argentina", continent: "South America", type: "Main", veg: false, description: "Cuts of beef grilled slowly over glowing coals and shared.", ingredients: "Beef, salt, chimichurri, coals" },
  { name: "Empanadas", country: "Argentina", continent: "South America", type: "Street food", veg: false, description: "Baked pastry pockets with spiced beef, egg or melted cheese.", ingredients: "Flour, beef, onion, egg" },
  { name: "Arepas", country: "Colombia", continent: "South America", type: "Street food", veg: true, description: "Griddled corn cakes split open and filled with fresh cheese.", ingredients: "Cornmeal, cheese, butter, salt" },
  { name: "Saltenas", country: "Bolivia", continent: "South America", type: "Street food", veg: false, description: "Juicy baked pastries filled with stewed meat, potato and olives.", ingredients: "Pastry, beef, potato, olives" },
  { name: "Completo", country: "Chile", continent: "South America", type: "Street food", veg: false, description: "Loaded hot dog with avocado, tomato and a ribbon of mayonnaise.", ingredients: "Sausage, bun, avocado, mayonnaise" },

  // Africa
  { name: "Tagine", country: "Morocco", continent: "Africa", type: "Main", veg: false, description: "Slow-cooked lamb with preserved lemon, olives and warm spices.", ingredients: "Lamb, preserved lemon, olives, spices" },
  { name: "Couscous", country: "Morocco", continent: "Africa", type: "Main", veg: true, description: "Steamed semolina mounded with vegetables and chickpeas.", ingredients: "Semolina, chickpeas, carrot, turnip" },
  { name: "Koshari", country: "Egypt", continent: "Africa", type: "Street food", veg: true, description: "Rice, lentils and pasta under tomato sauce and crisp fried onion.", ingredients: "Rice, lentils, pasta, tomato" },
  { name: "Ful Medames", country: "Egypt", continent: "Africa", type: "Street food", veg: true, description: "Slow-cooked fava beans with olive oil, lemon and cumin.", ingredients: "Fava beans, olive oil, lemon, cumin" },
  { name: "Jollof Rice", country: "Nigeria", continent: "Africa", type: "Main", veg: true, description: "Smoky tomato and pepper rice cooked down until each grain stands alone.", ingredients: "Rice, tomato, pepper, onion" },
  { name: "Suya", country: "Nigeria", continent: "Africa", type: "Street food", veg: false, description: "Beef skewers dusted with ground peanut, chilli and ginger.", ingredients: "Beef, peanut, chilli, ginger" },
  { name: "Doro Wat", country: "Ethiopia", continent: "Africa", type: "Main", veg: false, description: "Fiery chicken and egg stew scooped up with sour injera flatbread.", ingredients: "Chicken, berbere, egg, teff" },
  { name: "Bobotie", country: "South Africa", continent: "Africa", type: "Main", veg: false, description: "Curried mince bake under a savoury baked custard top.", ingredients: "Mince, curry powder, egg, milk" },
  { name: "Bunny Chow", country: "South Africa", continent: "Africa", type: "Street food", veg: false, description: "Durban curry served inside a hollowed-out half loaf of bread.", ingredients: "Bread, curry, chicken, potato" },
  { name: "Ugali and Sukuma Wiki", country: "Kenya", continent: "Africa", type: "Main", veg: true, description: "Stiff maize meal with braised greens, tomato and onion.", ingredients: "Maize flour, kale, tomato, onion" },

  // Oceania
  { name: "Meat Pie", country: "Australia", continent: "Oceania", type: "Street food", veg: false, description: "Hand-held pastry filled with minced beef, gravy and tomato sauce.", ingredients: "Pastry, beef, gravy, tomato sauce" },
  { name: "Lamington", country: "Australia", continent: "Oceania", type: "Dessert", veg: true, description: "Sponge cake squares dipped in chocolate and rolled in coconut.", ingredients: "Sponge, chocolate, coconut, jam" },
  { name: "Pavlova", country: "New Zealand", continent: "Oceania", type: "Dessert", veg: true, description: "Crisp meringue shell topped with whipped cream and kiwifruit.", ingredients: "Egg white, sugar, cream, kiwifruit" },
  { name: "Hangi", country: "New Zealand", continent: "Oceania", type: "Main", veg: false, description: "Meat and root vegetables steam-cooked in a heated earth oven.", ingredients: "Lamb, potato, kumara, cabbage" },
  { name: "Kokoda", country: "Fiji", continent: "Oceania", type: "Main", veg: false, description: "Fish cured in lime and coconut cream with chilli and tomato.", ingredients: "Fish, lime, coconut cream, chilli" },
  { name: "Palusami", country: "Samoa", continent: "Oceania", type: "Main", veg: true, description: "Taro leaves baked in coconut cream until soft and rich.", ingredients: "Taro leaves, coconut cream, onion" },
];

export const FOOD_TYPES = ["Street food", "Main", "Dessert", "Drink"];