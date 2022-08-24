import React,{useEffect,useState} from "react";
import styles from "./styles.module.css";

const Lower = ({data}) => {

  // console.log(data);

  // const category = ['DDoS', 'DoS', 'Normal', 'Reconnaissance', 'Theft']
  // const subcategory = ['Data_Exfiltration','HTTP','Keylogging','Normal','OS_Fingerprint','Service_Scan','TCP','UDP']
  const cat_init = {
    DDoS: 0,
    DoS: 0,
    Normal: 0,
    Reconnaissance: 0,
    Theft: 0,
  }
  const sub_init = {
    Data_Exfiltration: 0,
    HTTP: 0,
    Keylogging: 0,
    Normal: 0,
    OS_Fingerprint: 0,
    Service_Scan: 0,
    TCP: 0,
    UDP: 0,
  }
  const [cat,setCat] = useState({...cat_init})
  const [sub,setSub] = useState({...sub_init})
  const [packets,setPackets] = useState(0)
  const [vuls,setVuls] = useState(0)
  const [catSelected,setCatSelected] = useState("")
  const [subSelected,setSubSelected] = useState("")

  const resetData = () => {
    const cat_ = {...cat_init}
    const sub_ = {...sub_init}
    let packets_ = 0
    Object.entries(data).forEach(([c,cv]) => {
      cat_[c] = cv.count
      packets_ += cv.count
      Object.entries(cv.subcategory).forEach(([s,sv]) => {
        sub_[s] += sv
      })
    });
    setCat(cat_)
    setSub(sub_)
    setPackets(packets_)
    setVuls(packets_-cat_['Normal'])
  }

  const setNums = () => {
    let packets_ = 0
    let normal_ = 0
    Object.entries(data).forEach(([c,cv]) => {
      packets_ += cv.count
      if(cv==='Normal') normal_ = cv
    });
    setPackets(packets_)
    setVuls(packets_-normal_)
  }

  useEffect(() => {
    setNums()
    if(catSelected) handleCat('$')
    else if(subSelected) handleSub('$')
    else resetData()
  },[data])

  const handleCat = (cs) => {
    if(cs===catSelected) {
      setCatSelected("")
      resetData()
    } else {
      if(cs==='$') {
        cs = catSelected
      } else {
        setCatSelected(cs)
        setSubSelected("")
      }
      const cat_ = {...cat_init}
      const sub_ = {...sub_init}
      Object.entries(data).forEach(([c,cv]) => {
        if(c!==cs) cat_[c]=0
        else {
          cat_[c] = cv.count
          Object.entries(cv.subcategory).forEach(([s,sv]) => {
            sub_[s] = sv
          })
        }
      });
      setCat(cat_)
      setSub(sub_)
    }
  }

  const handleSub = (ss) => {
    if(ss===subSelected) {
      setSubSelected("")
      resetData()
    } else {
      if(ss==='$') {
        ss = subSelected
      } else {
        setSubSelected(ss)
        setCatSelected("")
      }
      const cat_ = {...cat_init}
      const sub_ = {...sub_init}
      sub_[ss]=0
      Object.entries(data).forEach(([c,cv]) => {
        cat_[c]=cv.subcategory[ss]
        Object.entries(cv.subcategory).forEach(([s,sv]) => {
          if(s!==ss) sub_[s] = 0
          else sub_[s]+=sv
        })
      });
      setCat(cat_)
      setSub(sub_)
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.packets}>{packets}</div>
      <div className={styles.vulnerability}>{vuls}</div>
      <div className={styles.categories}>
        {Object.entries(cat).map(([c,v]) => {
          let box_class = (c!==catSelected) ? styles.cat_box : styles.cat_box_selected
          return (
            <div key={c} className={box_class} onClick={() => handleCat(c)}>
              <p className={styles.cat_name}>{c}</p>
              <p className={styles.cat_val}>{v}</p>
            </div>
            )
          })}
      </div>
      <div className={styles.subcategories}>
        {Object.entries(sub).map(([s,v]) => {
          let box_class = (s!==subSelected) ? styles.sub_box : styles.sub_box_selected
          return (
            <div key={s} className={box_class} onClick={() => handleSub(s)}>
              <p className={styles.sub_name}>{s}</p>
              <p className={styles.sub_val}>{v}</p>
            </div>
          )
          })}
      </div>
    </div>
  );
};

export default Lower;