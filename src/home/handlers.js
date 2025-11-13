export function getHomeHandler() {
  return {
    home: (req, res) => {
      res.render('home', {
        title: 'Home',
        page: 'home',
      });
    },
    about: (req, res) => {
      res.render('about', {
        title: 'About',
        page: 'about',
      });
    },
    healthz: (req, res) => {
      res.status(200).send('OK');
    },
  };
}
