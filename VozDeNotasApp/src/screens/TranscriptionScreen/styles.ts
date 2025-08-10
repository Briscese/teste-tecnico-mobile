import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
  },
  resultsContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
  },
  resultText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0A84FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  micButtonActive: {
    backgroundColor: '#FF3B30',
  },
  micIcon: {
    fontSize: 40,
  },
  statusText: {
    color: '#8E8E93',
    fontSize: 16,
    marginBottom: 20,
  },
  errorText: {
    color: 'yellow',
    marginTop: 10,
  },
});

export default styles;