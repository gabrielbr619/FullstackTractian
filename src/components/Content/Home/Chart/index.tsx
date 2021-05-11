
import { useEffect, useState } from "react";
import Styles from './styles.module.scss'

import Highcharts from "highcharts";
import HighchartsReact from 'highcharts-react-official';

export default function Charts() {
  const [dadosBranch, setDadosBranch] = useState([])
  const [dadosActive, setDadosActive] = useState([])

  const [newData, setNewData] = useState(false)
  const [loaded, setLoaded] = useState(false)



  useEffect(() => {
    async function api<T>(url: string): Promise<T> {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      setLoaded(true)
      return await response.json();
    }

    api('https://backend-challenge-tractian.herokuapp.com/branch')
      .then(data => setDadosBranch([data]))
      .catch(error => {
      })
    setDadosActive(dadosBranch.map(d => d.map(data => data)))
    setNewData(false)

    api('https://backend-challenge-tractian.herokuapp.com/active')
      .then(data => setDadosActive([data]))
      .catch(error => {
      })
    setDadosActive(dadosBranch.map(d => d.map(data => data)))
    setNewData(false)


  }, [])




  function renderCharts() {
    if (loaded) {
      if (dadosBranch.length > 0 && dadosActive.length > 0) {
        const [branch] = dadosBranch
        const [active] = dadosActive
        let obj = {}
        let obj2 = {}
        const numberOfActivesArray = []
        const activesHealthLevelsArray = []
        const branchNamesArray = branch.map(branch => branch.name)
        const numberOfActivesArrayOfActivesBigArray = branch.map(t => t.active.length > 0 ? t.active.length : 0)
        for (var i = 0; i < numberOfActivesArrayOfActivesBigArray.length; i++) {
          numberOfActivesArray.push(numberOfActivesArrayOfActivesBigArray.slice(i, i + 1));
        }

        const BranchNames = branchNamesArray.map(t => obj = { "name": t })
        BranchNames.forEach((el, i) => {
          el.data = numberOfActivesArray[i]
        });
        const activesHealthLevelsBigArray = active.map(t => t.healthLevel)
        for (let i = 0; i < activesHealthLevelsBigArray.length; i++) {
          activesHealthLevelsArray.push(activesHealthLevelsBigArray.slice(i, i + 1))
        }
        const ActivesNameXHealthLevels = active.map(t => obj2 = { "name": t.name })
        const ActivesNames = active.map(t => t.name)
        console.log(ActivesNames)
        ActivesNameXHealthLevels.forEach((el, i) => {
          el.data = activesHealthLevelsArray[i]
        })
        ActivesNameXHealthLevels.forEach((el, i) => {
          if (el.data > 65) {
            el.color = "#268FFF"
          } else if (el.data <= 64 && el.data >= 35) {
            el.color = "#FFCA2C"
          } else {
            el.color = "#E15361"
          }
        })

        const optionsAtivosPorUnidades = {
          credits: { enabled: false },
          chart: {
            type: 'column',
            width: 400,
            height: 350,
            borderRadius: 20,
            className: `${Styles.chart}`
          },
          title: {
            text: 'Ativos por Unidades'
          },
          series:
            BranchNames
        }

        const optionsSaudePorAtivos = {
          chart: {
            type: 'column',
            max: 100,
            width: 500,
            height: 350,
            borderRadius: 20,
            className: `${Styles.chart}`,
            backgroundColor: "#1f123a",
          },
          credits: { enabled: false },
          plotOptions: {
            series: {borderColor: '#1f123a'},

            column: {
              dataLabels: {
                enabled: true,
                format: `{point.y:1f}%`,
                crop: false,
                overflow: "none",
                style: {
                  color: "#FFF",
                  borderColor: '#1f123a'
                }
              },
              enableMouseTracking: false
            },
          },
          yAxis: {
            max: 100,
            labels: {
              style: {
                color: 'white'
              }
            },
            title: {
              text: "Nível de Saúde",
              style: {
                color: "#FFF",
                borderColor: '#1f123a'
              }
            }
          },
          legend: {
            itemStyle: {
              color: "white"
            }
          },
          title: {
            style: {
              borderColor: '#1f123a',
              color: "#FFF"
            },
            text: 'Saúde dos Ativos'
          },
          series: ActivesNameXHealthLevels
        }
        return (
          <div className={Styles.highchartsContainer}>
            <HighchartsReact
              highcharts={Highcharts}
              options={optionsAtivosPorUnidades}
              className={Styles.chart}
            >
            </HighchartsReact>
            <HighchartsReact
              highcharts={Highcharts}
              options={optionsSaudePorAtivos}>

            </HighchartsReact>
          </div>
        )
      }
    } else {
      return (<div className={Styles.load}>Carregando...</div>)
    }
  }

  return (
    <div>
      {renderCharts()}
    </div>
  )
}