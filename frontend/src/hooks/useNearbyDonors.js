import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import userService from '../services/userService';
import { useAuth } from './useAuth';

const useNearbyDonors = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useState({
        latitude: 10.7769, // Default to HCMC
        longitude: 106.7009,
        radius: 10, // in kilometers
        bloodTypeId: null,
    });

    // Set user's location as default when available
    useEffect(() => {
        if (user && user.latitude && user.longitude) {
            setSearchParams(prev => ({
                ...prev,
                latitude: user.latitude,
                longitude: user.longitude,
            }));
        }
    }, [user]);

    const searchDonors = useCallback(async() => {
        if (!searchParams.latitude || !searchParams.longitude) {
            throw new Error('User location is not available.');
        }
        const data = await userService.searchDonorsByLocation(searchParams);
        return data;
    }, [searchParams]);

    const {
        data: donors,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['nearbyDonors', searchParams],
        queryFn: searchDonors,
        enabled: false, // This query will only run when refetch is called
    });

    const handleSearch = useCallback(
        (params) => {
            // Nếu params là event (có preventDefault), bỏ qua
            if (params && typeof params.preventDefault === 'function') {
                return;
            }
            setSearchParams((prev) => ({...prev, ...params }));
        }, []
    );

    return {
        searchParams,
        handleSearch,
        donors: donors || [],
        isLoading,
        error,
        triggerSearch: refetch,
    };
};

export default useNearbyDonors;