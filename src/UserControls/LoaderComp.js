import { TailSpin } from "react-loader-spinner";
const LoaderComp = ({message}) => {
	return (
	<div className="loader-container">
      <TailSpin
        height={80}
        width={80}
        color="black"
        ariaLabel="tail-spin-loading"
        radius={2}
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
      <p>{message}</p>
	  </div>
	);
}; 
export default LoaderComp;
