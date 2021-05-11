import Content from "../Content";
import Header from "../Header";


export default function Main(){
  return(
    < div style={{display: "flex", flexDirection: "column", flexGrow:1}}>
    <Header/>
    <Content/>
    </ div>
  )
}