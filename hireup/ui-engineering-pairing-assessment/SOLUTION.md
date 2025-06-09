# Nav Bar Assessment

A simple navigation bar UI featuring a hamburger menu.

## Getting Started

1. Install dependencies:  
   ```bash
   npm install
   ```

2. Start the development server:  
   ```bash
   npm run dev
   ```

## Managing Multiple SVGs

This project uses **SVGR** to convert SVG files into React components. This allows you to import SVGs as React components with customizable props such as `className`, `style`, and `fill`.

To automate exporting all SVGs as React components, there is a script located at:  
`src/scripts/generate-icon-index.js`

Run the script using:  
```bash
node src/scripts/generate-icon-index.js
```

This will generate an index file for easy imports.

Additionally, an `Icon` component is provided, which lets you import and use any SVG by simply passing its name as a prop — no need to import dozens of SVG files individually.

---

### Reference

Legendary bug resolver, see:  
[StackOverflow: Importing SVG as ReactComponent in Vite](https://stackoverflow.com/questions/77284472/importing-svg-as-reactcomponent-in-vite-ambiguous-indirect-export-reactcompon)