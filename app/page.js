'use client'
import { useState, useEffect } from 'react'
import { firestore } from "@/firebase"
import { Box, Modal, Typography, Stack, TextField, Button, Grid, Paper } from "@mui/material"
import { query, collection, getDocs, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore"

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'))
      const docs = await getDocs(snapshot)
      const inventoryList = []
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        })
      })
      setInventory(inventoryList.reverse())  // Reverse the order to show recently added items first
    } catch (error) {
      console.error('Error updating inventory:', error)
    }
  }

  const addItem = async () => {
    const item = itemName.trim()
    if (!item) {
      alert('Please enter an item name')
      return
    }

    try {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        await setDoc(docRef, { quantity: quantity + 1 }, { merge: true })
        console.log('Document updated with new quantity')

        // Update state to reflect the new quantity
        setInventory(prevInventory => prevInventory.map(
          invItem => invItem.name === item ? { ...invItem, quantity: quantity + 1 } : invItem
        ))
      } else {
        await setDoc(docRef, { quantity: 1 })
        console.log('Document created with quantity 1')

        // Prepend new item to the inventory list
        setInventory(prevInventory => [{
          name: item,
          quantity: 1
        }, ...prevInventory])
      }

      setItemName('')
      handleClose()
    } catch (error) {
      console.error('Error adding item:', error)
      alert('Error adding item, please try again')
    }
  }

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        if (quantity === 1) {
          await deleteDoc(docRef)
          setInventory(prevInventory => prevInventory.filter(invItem => invItem.name !== item))
        } else {
          await setDoc(docRef, { quantity: quantity - 1 })
          setInventory(prevInventory => prevInventory.map(
            invItem => invItem.name === item ? { ...invItem, quantity: quantity - 1 } : invItem
          ))
        }
      }

      await updateInventory()
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Filtered inventory based on the search term
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      p={4}
      gap={2}
    >
      <Typography variant="h2" color="primary" gutterBottom>
        Pantry Inventory
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add New Item
      </Button>
      <TextField
        variant="outlined"
        placeholder="Search items"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2, width: '80%' }}
      />
      <Grid container spacing={2} sx={{ width: '80%' }}>
        {filteredInventory.map(({ name, quantity }) => (
          <Grid item xs={12} sm={6} md={4} key={name}>
            <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="body1">
                Quantity: {quantity}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 1 }}
                onClick={() => removeItem(name)}
              >
                Remove
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          maxHeight="90vh"  // Set max height for the modal
          bgcolor="white"
          border="2px solid #9C27B0"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
            overflowY: 'auto'  // Enable vertical scrolling
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={addItem}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  )
}
