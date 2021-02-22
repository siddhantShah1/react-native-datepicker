import React, {useState, useEffect, useRef} from 'react'
import {View, TouchableOpacity, Text, StyleSheet, Animated} from 'react-native'
import { _getCalendarBody, _getCalendarInitialDetails } from '../helpers/index'
import { calendarFunctions } from '../helpers/secondaryHelpers'
import { calendarData } from '../helpers/CalenderData'

const CalendarWeek = ({
  calendarDetails,
  onDateClick,
  selectedDay,
  fromDate,
  toDate
}) => {
  const [dateLists, setDateLists] = useState({
    current: [],
    other: [],
    rawDates: []
  })

  const dateFormatted = '%D, %M %d, %y'
  const [curMonth, setCurMonth] = useState();

  useEffect(()=>{
    const {formattedDate } = _getCalendarInitialDetails(0,dateFormatted)
     const arr = formattedDate.split(',')
     const tempMonth = arr[1].split(' ')
     setCurMonth(tempMonth)
  },[])

  useEffect(() => {
    const temp = _getCalendarBody(calendarDetails)
    setDateLists(temp)
  }, [calendarDetails])

  const { bsYear, bsMonth, bsDate } = calendarDetails
  const currentDay = calendarFunctions.getNepaliNumber(bsDate)
  const { current, rawDates } = dateLists
  const startFromDay = rawDates.filter((f) => f < 1).length + 1

  if(current[0] !== 'b'){
    for (let index = 0; index < (startFromDay-1); index++) {
      current.unshift('b')
    }
  }
  

  // const [fadeAnim] = useState(new Animated.Value(0))

  // useEffect(() => {
  //   Animated.timing(
  //     fadeAnim,
  //     {
  //       toValue: 1,
  //       duration: 3000,
  //       useNativeDriver: true,
  //     }
  //   ).start(fadeAnim.resetAnimation());
  // })
//  <Animated.View
//     style={{
//       opacity: fadeAnim
//     }}
//     >

return (
    <View style={{        
      flexDirection:'row',
      width: 350, 
      height:200, 
      flexWrap: 'wrap'
    }}>

      {current.map((day, index) => {

        let temp = new Date()
        let customCurrentDay = null;


        if(curMonth[2] === day && calendarData.bsMonths.indexOf(curMonth[1]) === (bsMonth -1)){
           customCurrentDay = day === currentDay ? `currentday` : ''
          //  const ind = true;
        }
        const selectedButton =
          !!selectedDay && selectedDay === (index - (startFromDay - 1)) + 1 ? true : false

        // const isDisabled = checkIfDateIsDisable(
        //   bsYear,
        //   bsMonth,
        //   index + 1,
        //   fromDate,
        //   toDate
        // )
        // const disbledClass = isDisabled ? styles.disabled : ''

        const invis = day === 'b' ? '' : day
        const bool = day === 'b' ? true : false

        return (
            
      <View
      key={`${day}-${index}-${temp.getUTCMilliseconds()}`}
      style={{
        height:40,
        width:50, 
        justifyContent:'space-around'
      }}>

        {customCurrentDay ? 
          <TouchableOpacity
          style={stylesInline.current}
          key={`${day}-${index}`}
          onPress={bool ? f=>f : () => onDateClick((index - (startFromDay - 1)) + 1)}
          >
          <Text style={{textAlign: 'center', alignItems:'center', color:'#2196F3'}}>{invis}</Text>
        </TouchableOpacity> : 

        selectedButton ?
          <TouchableOpacity
          style={stylesInline.item}
          key={`${day}-${index}`}
          onPress={bool ? f=>f : () => onDateClick((index - (startFromDay - 1)) + 1)}>
          <Text style={{textAlign: 'center', alignItems:'center', fontWeight:'bold', 
          color:`red`, borderColor: `red`, borderWidth:2, borderRadius:15
          }}>{invis}</Text>
        </TouchableOpacity> :


          <TouchableOpacity
          style={stylesInline.item}
          key={`${day}-${index}`}
          onPress={bool ? f=>f : () => onDateClick((index - (startFromDay - 1)) + 1)}>
          <Text style={{textAlign: 'center', alignItems:'center'}}>{invis}</Text>
        </TouchableOpacity>}     
      </View>)
      })}
      
    </View>
    // </Animated.View>
    )

  }
    
const checkIfDateIsDisable = (
  bsYear,
  bsMonth,
  bsDay,
  fromDate,
  toDate
) => {
  let check = { first: false, second: false }
  try {
    const selectedDate = `${bsYear}-${
      bsMonth < 10 ? '0' + bsMonth : bsMonth
    }-${bsDay < 10 ? '0' + bsDay : bsDay}`
    if (!!fromDate) {
      const isCorrectFromDate = fromDate.match(/^\d{4}\-\d{1,2}\-\d{1,2}$/)
      if (!isCorrectFromDate) {
        throw Error('Wrong From Date Format')
      } else {
        check.first = diffDate(selectedDate, fromDate) < 0
      }
    }
    if (!!toDate) {
      const isCorrectFromDate = toDate.match(/^\d{4}\-\d{1,2}\-\d{1,2}$/)
      if (!isCorrectFromDate) {
        throw Error('Wrong From Date Format')
      } else {
        check.second = diffDate(toDate, selectedDate) < 0
      }
    }
  } catch (e) {
    throw Error(e)
  }
  return check.first || check.second
}
const diffDate = (end_date, start_date) =>
  parseInt(end_date.replace(/-/g, '')) - parseInt(start_date.replace(/-/g, ''))

export default CalendarWeek

const stylesInline = StyleSheet.create({
  container:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 350
  },
  item:{
    textAlign: 'center'
  },
  text:{
    color: 'black', 
    textAlign:'center'
  },
  textInvis:{
    textAlign: 'center',
    display:'none'
  },
  current:{
    borderColor:'#2196F3',
   
    borderWidth:2,
    borderRadius:15
  }
})