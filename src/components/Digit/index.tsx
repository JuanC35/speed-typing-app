import styles from './styles.module.css';

type DigitProps = {
  value: number,
  isChanged: boolean,
  type: number
}

export default function Digit({ value, isChanged, type }: DigitProps) {

  return <>
    {type === 0 ? 
      <span className={`${styles.digit} ${isChanged ? styles.exit : !isChanged ? styles.enter : ''}`}>{value}</span> :
      <span className={`${styles.digit} ${isChanged ? styles.exit1 : !isChanged ? styles.enter1 : ''}`}>{value}</span> 
    } 

  </>
}