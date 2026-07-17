import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationBell from "./NotificationBell";

const BASE_URL = "http://127.0.0.1:5000";

function Navbar() {

  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();


  const totalItems =
    cartItems?.reduce(
      (sum, item) =>
        sum + Number(item.quantity || item.qty || 1),
      0
    ) || 0;



  const handleLogout = () => {
    logout();
    navigate("/login");
  };



  const getAvatarUrl = () => {

    if (!user?.avatar_url) return null;

    const avatar = user.avatar_url;


    if (
      avatar.startsWith("http://") ||
      avatar.startsWith("https://")
    ) {
      return avatar;
    }


    return `${BASE_URL}${avatar}`;
  };



  return (

    <nav style={styles.nav}>


      <Link to="/" style={styles.logo}>
        🛒 ShopMart
      </Link>



      <div style={styles.links}>


        <Link to="/" style={styles.link}>
          Home
        </Link>



        {user && (
          <>

            <Link to="/orders" style={styles.link}>
              Orders
            </Link>


            <Link to="/profile" style={styles.link}>
              My Profile
            </Link>



            <Link to="/cart" style={styles.cart}>

              Cart 🛒

              {totalItems > 0 && (

                <span style={styles.badge}>
                  {totalItems}
                </span>

              )}

            </Link>

          </>
        )}




        {user?.role === "admin" && (

          <>

            <Link 
              to="/admin/products" 
              style={styles.link}
            >
              Admin Products
            </Link>


            <Link 
              to="/admin/orders" 
              style={styles.link}
            >
              Admin Orders
            </Link>

          </>

        )}






        <button
          onClick={toggleTheme}
          style={styles.themeBtn}
        >

          {theme === "light" ? "🌙" : "☀️"}

        </button>





        {!user ? (

          <>

            <Link to="/login" style={styles.link}>
              Login
            </Link>


            <Link to="/register" style={styles.link}>
              Register
            </Link>


          </>


        ) : (


          <div style={styles.userBox}>


            {user?.role === "admin" && (
              <NotificationBell />
            )}




            <Link
              to="/profile"
              style={styles.profileLink}
            >



              {getAvatarUrl() ? (


                <img
                  src={getAvatarUrl()}
                  alt="Avatar"
                  style={styles.avatar}
                />


              ) : (

<div style={styles.initials}>
  {user?.name
    ? user.name.charAt(0).toUpperCase()
    : "A"}
</div>


              )}




              <span style={styles.user}>
                {user.name}
              </span>


            </Link>





            <button
              onClick={handleLogout}
              style={styles.logoutBtn}
            >

              Logout

            </button>



          </div>

        )}



      </div>


    </nav>

  );

}



export default Navbar;





const styles = {


  nav: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    padding: "12px 30px",

    background: "var(--navbar-bg)",

    color: "var(--text)",

    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",

    position: "sticky",

    top: 0,

    zIndex: 1000,

  },




  logo: {

    fontSize: "22px",

    fontWeight: "bold",

    textDecoration: "none",

    color: "var(--text)",

  },




  links: {

    display: "flex",

    alignItems: "center",

    gap: "18px",

  },




  link: {

    textDecoration: "none",

    color: "var(--text)",

    fontWeight: "500",

  },




  cart: {

    position: "relative",

    textDecoration: "none",

    color: "var(--text)",

    fontWeight: "500",

  },




  badge: {

    position: "absolute",

    top: "-10px",

    right: "-12px",

    background: "red",

    color: "white",

    borderRadius: "50%",

    width: "20px",

    height: "20px",

    fontSize: "12px",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

  },





  themeBtn: {

    border: "none",

    background: "transparent",

    cursor: "pointer",

    fontSize: "20px",

  },





  userBox: {

    display: "flex",

    alignItems: "center",

    gap: "12px",

  },





  profileLink: {

    display: "flex",

    alignItems: "center",

    gap: "8px",

    textDecoration: "none",

    color: "var(--text)",

  },





 avatar: {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  objectFit: "cover",
  display: "block",
  opacity: 1,
  visibility: "visible",
  border: "2px solid #2563eb",
},




initials: {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  background: "#2563eb",
  color: "#ffffff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "bold",
},





  user: {

    fontWeight: "600",

  },





  logoutBtn: {

  padding: "7px 14px",

  border: "none",

  borderRadius: "6px",

  cursor: "pointer",

  background: "#ef4444",

  color: "#ffffff",

  fontWeight: "600",

},


};