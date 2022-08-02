import React, { useState, useEffect } from "react"
import Start from "./components/Start"
import { utils } from "ethers"
import Portfolio from "./components/Portfolio";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material"
import Box from '@mui/material/Box';


const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#310a69',
    },
    secondary: {
      main: '#153caf',
    },
    error: {
      main: '#cb1d11',
    },
    success: {
      main: '#128c17',
    },
    info: {
      main: '#42a5f5',
    },
  },
  typography: {
    fontFamily: 'Raleway',
  },
})


export default function App() {
  const [address, setAddress] = useState("")
  const [nftData, setNftData] = useState([])
  const [pageKey, setPageKey] = useState("")
  const [nftDataCleaned, setNftDataCleaned] = useState([])

  const getNftApi = `https://eth-mainnet.alchemyapi.io/nft/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}/getNFTs/?withMetadata=false&owner=`
  const getPriceApi = `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}/getFloorPrice?contractAddress=`



  useEffect(() => {
    const fetchMoreData = async (url) => {
      const res = await fetch(url)
      const response = await res.json()
      await setNftData(prev => [...prev, ...response.ownedNfts])
      if (response.pageKey) {
        await setPageKey(response.pageKey)
      }
      else {
        setPageKey("")
      }
    }

    if (pageKey !== "") {
      fetchMoreData(getNftApi + address + "&pageKey=" + pageKey).catch(err => console.error(err))
    }
  }, [pageKey])

  const throttledQueue = require('throttled-queue');
  const throttle = throttledQueue(20, 1000, true); // make at most 20 requests every second, but evenly spaced


  const fetchPrice = async (contractAddress) => {
    try {
      console.log("fetching price data for " + contractAddress)
      const res = await fetch(getPriceApi + contractAddress)
      const response = await res.json()
      let price
      if (response.openSea.floorPrice) {
        price = response.openSea.floorPrice
      }
      else {
        if (response.looksRare.floorPrice) {
          price = response.looksRare.floorPrice
        }
        else {
          price = 0
        }
      }
      await setNftDataCleaned(prev => prev.map(nft => (
        nft.address === contractAddress ? { ...nft, floorPrice: price, holding: price > 0 ? price * nft.count : 0 } : nft
      )))
    }
    catch (err) {
      console.error(err)
    }
  }


  useEffect(() => {
    if (nftData) {
      const nftAddressList = [...new Set(nftData.map(item => item.contract.address))]
      const cleanedNftData = nftAddressList.map(address => {

        return (
          {
            address: address
            , count: nftData.filter(data => data.contract.address === address).length
            , floorPrice: 0
          }
        )
      })
      setNftDataCleaned(cleanedNftData)
      nftAddressList.map(address => throttle(() => { fetchPrice(address) }))
    }
  }, [nftData])

  function handleChange(newValue) {
    setAddress(newValue)
  }

  function handleClick() {
    const fetchData = async (url) => {
      const res = await fetch(url)
      const response = await res.json()
      await setNftData(response.ownedNfts)
      if (response.pageKey) {
        await setPageKey(response.pageKey)
      }
    }

    if (utils.isAddress(address)) {
      fetchData(getNftApi + address).catch(err => console.error(err))
    }
    else {
      console.log("clicked!")
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className="App"
        sx={{
          width: 'auto',
          height: 'auto',
          maxWidth: 1200,
          mx: 20,
          my: 15,
        }}
      >
        <Box sx={{ mb: "1rem" }}>
          <Start
            value={address}
            handleChange={handleChange}
            handleClick={handleClick}
          />
        </Box>
        <Portfolio
          data={nftDataCleaned}
        />
      </Box>
    </ThemeProvider>
  );
}
