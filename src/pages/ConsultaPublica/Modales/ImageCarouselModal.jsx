import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    IconButton,
    Box,
    useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { useTheme } from '@mui/material/styles';

// eslint-disable-next-line react/prop-types
const ImageCarouselModal = ({ open, onClose, imageUrls = [] }) => {
    const [current, setCurrent] = useState(0);
    const [errorImages, setErrorImages] = useState({}); // guarda qué imágenes fallaron
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleNext = () => {
        setCurrent((prev) => (prev + 1) % imageUrls.length);
    };

    const handlePrev = () => {
        setCurrent((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
    };

    const handleError = (index) => {
        setErrorImages((prev) => ({ ...prev, [index]: true }));
    };

    return (
        <Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="md" fullWidth>
            <DialogContent sx={{ position: 'relative', p: 2 }}>
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'relative', top: 8, right: 8 }}
                >
                    <CloseIcon />
                </IconButton>

                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ position: 'relative', width: '100%', height: '60vh' }}
                >
                    <IconButton
                        onClick={handlePrev}
                        sx={{ position: 'absolute', left: 0, zIndex: 1 }}
                        disabled={imageUrls.length <= 1}
                    >
                        <ArrowBackIosNewIcon />
                    </IconButton>

                    {imageUrls.length === 0 || !imageUrls[current] || errorImages[current] ? (
                        <NoPhotographyIcon sx={{ fontSize: 100, color: 'grey.400' }} />
                    ) : (
                        <Box
                            component="img"
                            src={imageUrls[current]}
                            alt={`Imagen ${current + 1}`}
                            onError={() => handleError(current)}
                            sx={{
                                maxHeight: '100%',
                                maxWidth: '100%',
                                objectFit: 'contain',
                            }}
                        />
                    )}

                    <IconButton
                        onClick={handleNext}
                        sx={{ position: 'absolute', right: 0, zIndex: 1 }}
                        disabled={imageUrls.length <= 1}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>

                {/* Dots */}
                <Box display="flex" justifyContent="center" mt={2} gap={1}>
                    {imageUrls.map((_, i) => (
                        <Box
                            key={i}
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: i === current ? 'primary.main' : 'grey.400',
                            }}
                        />
                    ))}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ImageCarouselModal;
