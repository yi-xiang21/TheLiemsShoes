import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animation/Sandy Loading.json";
import "../../assets/css/user-loading-overlay.css";

function UserLoadingOverlay({ show, text = "Đang tải dữ liệu..." }) {
  if (!show) {
    return null;
  }

  return (
    <div className="user-loading-overlay" role="status" aria-live="polite" aria-busy="true">
      <div className="user-loading-overlay__content">
        <Lottie
          animationData={loadingAnimation}
          loop
          autoplay
          className="user-loading-overlay__animation"
        />
        <p className="user-loading-overlay__text">{text}</p>
      </div>
    </div>
  );
}

export default UserLoadingOverlay;
