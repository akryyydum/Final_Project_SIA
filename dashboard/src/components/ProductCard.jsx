import { Card, CardContent, CardMedia, Typography, Button } from "@mui/material";

export default function ProductCard({ product }) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={product.image}
        alt={product.name}
      />
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Typography variant="subtitle1">${product.price}</Typography>
        <Button variant="contained" color="primary">Add to Cart</Button>
      </CardContent>
    </Card>
  );
}
