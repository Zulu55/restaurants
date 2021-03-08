import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import firebase from 'firebase/app'

import Loading from '../../components/Loading'
import { getRestaurants } from '../../utils/actions'

export default function Restaurants({ navigation }) {
    const [user, setUser] = useState(null)
    const [startRestaurant, setStartRestaurant] = useState(null)
    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(false)

    const limitRestaurants = 7
    console.log("restaurants", restaurants)

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? setUser(true) : setUser(false)
        })
    }, [])


    useFocusEffect(
        useCallback(async() => {
            setLoading(true)
            const response = await getRestaurants(limitRestaurants)
            if (response.statusResponse) {
                setStartRestaurant(response.startRestaurant)
                setRestaurants(response.restaurants)
            }
            setLoading(false)
        }, [])
    )

    if (user === null) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return (
        <View style={styles.viewBody}>
            <Text>Restaurants...</Text>
            {
                user && (
                    <Icon
                        type="material-community"
                        name="plus"
                        color="#442484"
                        reverse
                        containerStyle={styles.btnContainer}
                        onPress={() => navigation.navigate("add-restaurant")}
                    />
                )
            }
            <Loading isVisible={loading} text="Cargando restaurantes..."/>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5
    }
})
