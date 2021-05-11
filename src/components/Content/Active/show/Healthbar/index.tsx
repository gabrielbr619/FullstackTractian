import Styles from "./styles.module.scss"

export default function HealthBar(props){

  const { bgcolor, completed } = props

  const fillerStyles = {
    width: `${completed}%`,
    backgroundColor: bgcolor,
  }

  return (
    <div className={Styles.container}>
      <div style={fillerStyles} className={Styles.fillerStyles}>
        <span className={Styles.labelStyles}>{`${completed}%`}</span>
      </div>
    </div>
  );
};
