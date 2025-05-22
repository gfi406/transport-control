import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          TransportControl
        </Typography>
        <Button color="inherit" component={Link} to="/">Главная</Button>
        <Button color="inherit" component={Link} to="/track-lists">Путевые листы</Button>
        <Button color="inherit" component={Link} to="/vehicles">Транспорт</Button>
        <Button color="inherit" component={Link} to="/drivers">Водители</Button>
        <Button color="inherit" component={Link} to="/reports">Отчеты</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;