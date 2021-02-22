import React from 'react'
import {View, Text} from 'react-native'
import { calendarData } from '../helpers/CalenderData'

const CalendarWeek = ({}) => {
  const { bsDays } = calendarData
  return (
    <View style={{
      flexDirection:'row', 
      height:40,
      width:350, 
      borderBottomColor: 'grey',
      borderBottomWidth: 2,
      borderTopColor: 'grey',
      borderTopWidth: 2,
      justifyContent:'space-around', 
      alignItems: 'center'
    }}>
      {bsDays.map((name, index) => {
        let temp = new Date()
        return (
          <Text key={`${temp.getUTCMilliseconds()}-${index}-${name}`} style={{fontWeight:'bold'}}>
            {name}
          </Text>
          )})}
    </View>
  )
}

export default CalendarWeek
