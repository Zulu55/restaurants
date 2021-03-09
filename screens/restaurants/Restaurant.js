import React, { useState, useEffect } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'

import Loading from '../../components/Loading'
import { getDocumentById } from '../../utils/actions'

export default function Restaurant({ navigation, route }) {
    const { id, name } = route.params
    const [restaurant, setRestaurant] = useState(null)

    navigation.setOptions({ title: name })
    
    useEffect(() => {
        (async() => {
            const response = await getDocumentById("restaurants", id)
            if (response.statusResponse) {
                setRestaurant(response.document)
            } else {
                setRestaurant({})
                Alert.alert("Ocurrió un problema cargando el restaurante, intente más tarde.")
            }
        })()
    }, [])

    if (!restaurant) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return (
        <View>
            <Text>{restaurant.description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
})
