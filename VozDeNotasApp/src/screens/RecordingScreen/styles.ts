import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerText: {
        color: '#FFFFFF',
        fontSize: 64,
        fontWeight: '200',
    },
    controlsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordIconStart: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FF3B30',
        borderWidth: 3,
        borderColor: '#000',
    },
    recordIconStop: {
        width: 30,
        height: 30,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },
    footerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    instructions: {
        color: '#8E8E93',
        fontSize: 16,
    }
});

export default styles;