import React, { useState, useEffect } from 'react'
import { View, Button, Text } from 'react-native'
import { calendarData } from '../helpers/CalenderData'
import { calendarFunctions } from '../helpers/secondaryHelpers'

const CalenderHeader = ({bsMonth, bsYear, changeMonth})=>{

  const [monthYearText, setMonthYearText] = useState('')
  const [disableMax, setDisableMax] = useState(false)
  const [disableMin, setDisableMin] = useState(false)

  useEffect(()=>{
    bsMonth > 0 && bsYear > 0 && getMonthYearText()
    setDisableMin(false)
    setDisableMax(false)
    
    if(bsYear === calendarData.maxBsYear && bsMonth === 12){
      setDisableMax(true)
    }
    if(bsYear === calendarData.minBsYear && bsMonth === 1){
      setDisableMin(true)
    }
  },[bsMonth, bsYear])

  const getMonthYearText = () => {
    var monthName = calendarData.bsMonths[bsMonth - 1]
    var year = calendarFunctions.getNepaliNumber(bsYear)
    setMonthYearText(`${monthName} ${year}`)
  }

  return (
    <View  style={{ flexDirection: 'row', height: 40,width: 350, alignContent:'flex-start', justifyContent:'space-around', marginTop:25,marginBottom:10}}>
      <Button title='&#x25C0;' onPress={() => changeMonth('prev')}  disabled={disableMin} />
      <Text style={{alignSelf:'center', fontSize:20, fontWeight:'bold'}}>{monthYearText}</Text>
      <Button title='&#x25B6;' onPress={() => changeMonth('next')}  disabled={disableMax} />
    </View>
  )
}

export default CalenderHeader
