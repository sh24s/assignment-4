# Technical Documentation  
## Super Shahad Portfolio 
This project is a fully front-end portfolio website built with HTML, CSS, and JavaScript. It includes animations, sound effects, user personalization, project filtering, and GitHub API integration.


## 1. Structure
assignment-4/
│── index.html
│── README.md
│── css/
│ └── styles.css
│── js/
│ └── script.js
│── assets/
│ ├── images/
│ └── sounds/
│── docs/
│ ├── ai-usage-report.md
│ └── technical-documentation.md
└── presentation/
├── slides.pdf
└── demo-video.mp4


## 2. Main Features

### Skill Blocks  
Interactive Mario-style blocks using `data-skill`.  
On click: reveal text + play sound + save in localStorage.

### Theme Toggle  
Light/dark mode stored in localStorage.

### Personalized Greeting  
Saves user’s name and displays a time-based greeting.

### Visit Counter + Timer  
Counts total visits and time spent on page.

### Projects System  
Projects stored in a JavaScript array.  
Supports:
- Search  
- Filter (Beginner / Intermediate / Advanced)  
- Sort (Title / Date)

### GitHub API  
Fetches and displays latest repositories from GitHub.

### Contact Form  
Front-end validation for name, email, and message.

## 3. Technologies Used
- **HTML5** (structure)  
- **CSS3** (Mario styling, animations)  
- **JavaScript** (logic, filters, personalization)  
- **LocalStorage** (saving settings)  
- **Fetch API** (GitHub repos)

## 4. Deployment
The site is static and deployed easily on GitHub Pages, Netlify, or Vercel.

## 5. Future Improvements
- Add project detail pages  
- Add more animations and sound effects  
- Add achievements or levels



