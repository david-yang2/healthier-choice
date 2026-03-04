import { useNavigate } from "react-router-dom";


const Splash = () => {
const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <div style={styles.subContainer}>
        <div style={styles.appName}>Healthier Choice</div>
        <p style={{textAlign:"justify"}}>
          Simply take a picture of the ingredients and we'll help you identify
          harmful ingredients according to the Center for Science in the Public
          Interest (CSPI)
        </p>
        <button onClick={() => navigate("/camera")}> Let's Get Started </button>
      </div>
    </div>
  );
};

export default Splash;

const styles = {
  container: {
    backgroundImage: "url(/splash.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  subContainer : {
    maxWidth:"75%",
    display:"flex", 
    flexDirection: "column",
    justifyContent: "center",
    alignItems:"center"
  }, 
  appName: {
    fontSize:42, fontWeight:"bold"
  }
};


