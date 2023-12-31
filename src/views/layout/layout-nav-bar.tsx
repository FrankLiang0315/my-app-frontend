"use client";
import { useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import PetsIcon from "@mui/icons-material/Pets";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";

const pages = ["Products", "Pricing", "Blog"];

export default function LayoutNavBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const auth = useContext(AuthContext);
  const router = useRouter();

  const settings = [
    // { name: "Profile", onClick: () => null },
    // { name: "Account", onClick: () => null },
    // { name: "Dashboard", onClick: () => null },
    { name: "登出", onClick: () => logout() },
  ];



  const getPages =  () => {
    let pages = [];
    if(auth.roles.includes("Admin")) {
      pages  = [
        { name: "訂單管理", onClick: () => router.push("/admin/order-management") },
        { name: "用戶管理", onClick: () => router.push("/admin/user-management") },
        { name: "管理員管理", onClick: () => router.push("/admin/admin-management") },
      ];
    }else {
      pages = [
        { name: "產品", onClick: () => router.push("/product") },
        { name: "您的寵物", onClick: () => router.push("/pet") },
        { name: "購物車", onClick: () => router.push("/cart") },
        { name: "訂單查詢", onClick: () => router.push("/order") },
        { name: "mhn", onClick: () => router.push("/mhn") },
      ]
      
    }
      return pages;
  };

  const logout = () => {
    localStorage.removeItem("LoginToken");
    setAnchorElUser(null);
    location.replace("/");
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <PetsIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => router.push("/")}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            憨吉Hangi
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {getPages().map((page) => (
                <MenuItem key={page.name} onClick={page.onClick}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <PetsIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="p"
            onClick={() => router.push("/")}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            憨吉Hangi
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {getPages().map((page) => (
              <Button
                key={page.name}
                onClick={page.onClick}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {!auth.isLogin ? (
              <Button
                color="inherit"
                variant="text"
                onClick={() => router.push("/login")}
              >
                登入
              </Button>
            ) : (
              <>
                <Tooltip title="使用者">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>

                    <AccountCircleIcon fontSize="large" sx={{ color: "white"}}/>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting.name} onClick={setting.onClick}>
                      <Typography textAlign="center">{setting.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
