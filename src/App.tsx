import { useEffect, useState } from 'react';
import * as C from './App.styles'

import logoImage from './assets/devmemory_logo.png'
import RestartIcon from './svgs/restart.svg'

import { InfoItem } from './components/InfoItem';
import { Button } from './components/Button';
import { GridItem } from './components/GridItem';

import { GridItemType } from './types/GridItemType';
import { items } from './data/items';
import { formatTimeElapsed } from './helpers/fotmatTimeElapsed';

const App = () => {
  const [playing, setPlaying] = useState<boolean>(false)
  const [timeElapsed, setTimeElapsed] = useState<number>(0)
  const [moveCount, setMoveCount] = useState<number>(0)
  const [shownCount, setShownCount] = useState<number>(0)
  const [gridItems, setGridItems] = useState<GridItemType[]>([])
  
  useEffect(() => resetAndCreateGrid(), [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (playing) setTimeElapsed(timeElapsed + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [playing, timeElapsed])

  useEffect(() => {
    if (shownCount === 2) {
      let opened = gridItems.filter(item => item.shown)

      if (opened.length === 2) {

        if (opened[0].item === opened[1].item) {
          let tmpGrid = [...gridItems]
          for (let i in tmpGrid) {
            if (tmpGrid[i].shown) {
              tmpGrid[i].permanentShown = true
              tmpGrid[i].shown = false
            }
          }
          setGridItems(tmpGrid)
          setShownCount(0)
        } else {
          setTimeout(() => {
            let tmpGrid = [...gridItems]
            for (let i in tmpGrid) {
              tmpGrid[i].shown = false
            }

            setGridItems(tmpGrid)
            setShownCount(0)
          }, 1000)
        }
        setMoveCount(moveCount + 1)
      }
    }
  }, [shownCount, gridItems])

  useEffect(() => {
    if (moveCount > 0 && gridItems.every(item => item.permanentShown)) {
      setPlaying(false)
    }
  }, [moveCount, gridItems])

  const resetAndCreateGrid = () => {
    // step 1 - Reset game
    setTimeElapsed(0)
    setMoveCount(0)
    setShownCount(0)
    
    // step 2 - Create grid
    let tempGrid: GridItemType[] = []
    for(let i =0; i < (items.length * 2); i++) tempGrid.push({
      item: null, shown: false, permanentShown: false
    })

    for(let w = 0; w < 2; w++) {
      for (let i = 0; i < items.length; i++) {
        let pos = -1
        while(pos < 0 || tempGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2))

        }
        tempGrid[pos].item = i;
      }
    }

    setGridItems(tempGrid)
    // step 3 - start the game
    setPlaying(true)
  }

  const hendleItemClick = (index: number) => {
    if (playing && index !== null && shownCount < 2) {
      let tpmGrid = [...gridItems]

      if (!tpmGrid[index].permanentShown && !tpmGrid[index].shown) {
        tpmGrid[index].shown = true
        setShownCount(shownCount + 1)
      }

      setGridItems(tpmGrid)
    }
  }
  
  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width="200" alt="" />
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label="Movimentos" value={moveCount.toString()} />
        </C.InfoArea>

        <Button label="Reiniciar" icon={RestartIcon} onClick={resetAndCreateGrid} />
      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index)=>(
            <GridItem 
              key={index}
              item={item}
              onClick={() => hendleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
}

export default App;