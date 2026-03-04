import Razorpay from "razorpay";

/**
 * Lazily initialized Razorpay instance
 * (avoids crash when keys are not yet configured)
 */
let _instance = null;

const getRazorpayInstance = () => {
    if (!_instance) {
        _instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    return _instance;
};

export { getRazorpayInstance };
export default getRazorpayInstance;
