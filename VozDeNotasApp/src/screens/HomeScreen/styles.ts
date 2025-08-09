import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  noteItem: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notePlayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playIcon: {
    color: '#0A84FF',
    fontSize: 24,
    marginRight: 15,
  },
  noteDetails: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  noteDurationText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteDateText: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 4,
  },
  deleteIcon: {
    fontSize: 22,
    marginLeft: 15,
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#3A3A3C',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 16,
  } 
});

export default styles;