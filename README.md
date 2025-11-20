# 🎡 Pokémon Wheel Spinner

An interactive web application featuring a spinning wheel that randomly selects Pokémon across multiple categories and a comprehensive Pokédex search system.

## 🌟 Features

- **21+ Wheel Modes**: Spin across different Pokémon generations, legendary Pokémon, special forms, and more
- **Pokédex Search**: Search for Pokémon, moves, abilities, items, types, and more
- **Shiny Mode**: Toggle to see shiny Pokémon variants
- **Multiple Categories**:
  - Generation 1-9 Pokémon
  - Legendary & Mythical Pokémon
  - Eeveelutions
  - Paradox Pokémon
  - Starter Pokémon
  - Z-Moves & Gigantamax Forms
  - Regional Forms
  - Mega Evolution
  - Pokémon Games (1996-2025)
  - And more!

- **Pokédex Features**:
  - Search by name, number, or partial match
  - View Pokémon stats, types, and abilities
  - Browse moves and related Pokémon
  - View multiple Pokédex entries per game
  - Item and ability lookup
  - Type information and matchups

## 🚀 Getting Started

### Local Setup
```bash
# Clone the repository
git clone https://github.com/Zachary906/random-generator.git
cd random-generator

# Start the development server
npm start
# or
python3 -m http.server 8000

# Open in browser
# Visit http://localhost:8000
```

### Direct File Access
Simply open `index.html` in a modern web browser.

## 📋 Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for PokéAPI data)
- JavaScript enabled

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: [PokéAPI v2](https://pokeapi.co/) - Free Pokémon data API
- **Canvas**: HTML5 Canvas for wheel visualization
- **Responsive**: Mobile-friendly design

## 📁 File Structure

```
random-generator/
├── index.html           # Main application
├── script.js            # Application logic (3300+ lines)
├── style.css            # Styling
├── package.json         # Project metadata
└── README.md           # This file
```

## 🎮 How to Use

### Wheel Spinner
1. Select a wheel mode from the main menu
2. Click the Pokéball in the center of the wheel to spin
3. Watch the animation and see which Pokémon you landed on
4. Click "CLOSE" to reset and try another wheel

### Pokédex Search
1. Click "POKÉDEX SEARCH" from the main menu
2. Select a category (Pokémon, Moves, Abilities, etc.)
3. Enter your search term
4. Browse results and click on items for more details

### Shiny Mode
- Click "Toggle Shiny Mode" to enable/disable shiny Pokémon
- Works in wheel mode and search results

## 🎨 Customization

The application uses responsive design and can be customized by modifying:
- `style.css` - Colors, fonts, and layouts
- `script.js` - Wheel options, categories, and functionality
- `index.html` - Structure and HTML elements

## 🐛 Troubleshooting

**Wheel not spinning?**
- Ensure JavaScript is enabled
- Try refreshing the page
- Check browser console for errors

**Search not finding Pokémon?**
- Check internet connection
- Try partial names (e.g., "pika" for Pikachu)
- Use Pokédex numbers (e.g., "25" for Pikachu)

**Images not loading?**
- Ensure internet connection is stable
- PokéAPI may be temporarily unavailable

## 📊 Data Sources

- Pokémon data: [PokéAPI v2](https://pokeapi.co/)
- Games list: Updated through November 2025 (includes Legends: Z-A)
- TMs list: Custom compiled list with 31 entries

## 🔄 Updates & 2025 Content

The application includes:
- All Pokémon up to Generation 9 (#1-1025)
- Latest games through 2025
- Updated TM list with Tera Orb
- All regional variants and special forms

## 🤝 Contributing

To contribute improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## ⚠️ Disclaimer

Pokémon is a trademark of Nintendo/Game Freak. This project uses the PokéAPI for educational purposes and is not affiliated with or endorsed by Nintendo.

## 🙋 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the project maintainer.

---

**Last Updated**: November 2025
**Current Version**: 1.0.0