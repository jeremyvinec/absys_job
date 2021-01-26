package com.absys.test.service;

import com.absys.test.model.Criminal;
import com.absys.test.model.User;
import com.absys.test.model.UserState;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private SimpMessagingTemplate webSocketTemplate;

    // generate user list
    private static final List<User> memoryDatabase = new ArrayList<>();
        static {
            memoryDatabase.add(new User("SFES45", "DUPONT", "JEAN", new Date(120, 6, 1), "FRANCE", "FARMER"));
            memoryDatabase.add(new User("SFES45", "CLAUDE", "JEAN", new Date(120, 6, 1), "FRANCE", "SINGER"));
            memoryDatabase.add(new User("SFES46", "YVINEC", "JEREMY", new Date(), "BRETAGNE:)", "DEV"));
            memoryDatabase.add(new User("SFES47", "MICHEL", "JEAN", new Date(), "ITALY", "DESIGN"));
            memoryDatabase.add(new User("SFES47", "ROBIC", "JEAN", new Date(), "GERMANY", "DESIGN"));
        }
    
    private static List<Criminal> earthCriminalDatabase = Criminal.earthCriminal();
    /**
     * Create an ID and a user then return the ID
     * @param user
     * @return
     */
    public User createUser(User user) {
        try {
            // generate key
            String key = UUID.randomUUID().toString();
            user.setId(key);
            memoryDatabase.add(user);
            // notify
            webSocketTemplate.convertAndSend("/workflow/states", user);
            return user;
        } catch (Exception e) {
            throw new RuntimeException("Error has occured");
        }

    }

    public List<User> findAll() {
        return memoryDatabase;
    }

    /**
     *
     * @param userid
     * @return
     */
    public User workflow(String userid) {
        /* fetch user from memory database
        is the same function login
        Check criminal list during "EARTH_CONTROL" state, if the user is in the list, set state to REFUSED
        */
        User user = login(userid);
        /* next step on workflow
        change state in the order as below
        and check if user is not a criminal
        CREATED -> EARTH_CONTROL -> MARS_CONTROL -> DONE
        */
        switch (user.getState()) {
            case CREATED: user.setState(UserState.EARTH_CONTROL);
            break;
            case EARTH_CONTROL: 
            if (isCriminal(user)) {
                user.setState(UserState.REFUSED);
            } else {
                user.setState(UserState.MARS_CONTROL);
            }
            user.setState(UserState.MARS_CONTROL);
            break;
            case MARS_CONTROL: 
            if (userExist(user)) {
                user.setState(UserState.REFUSED);
            } else {
                user.setState(UserState.DONE);
            }
            break;
            default:
        }
        // send update to all users
        webSocketTemplate.convertAndSend("/workflow/states", user);
        return user;
    }

    public static boolean isCriminal(User user) {
      // function to check whether any user in list is a criminal
      return earthCriminalDatabase.stream().anyMatch(e -> 
        e.equals(user) && e.isNotAllowedToMars()
      );
    }

    public static boolean userExist(User user) {
        // function to check if a user already exists in the database
        return earthCriminalDatabase.stream().anyMatch(e -> 
        e.getState() == UserState.DONE && e.equals(user)
      );
    }


    /**
     * Return all user group by its job then its country
     * @return
     */
    public Object findByJobThenCountry(boolean sortedJob, boolean sortedCountry) {
        // TODO : Return an Object containing user sort by Job then Country (you are not allowed to just return List<User> sorted)
        List<User> users = memoryDatabase;
        List<User> result;
        Comparator<User> compareByJob = Comparator.comparing(User::getEarthJob);
        Comparator<User> compareByCountry = Comparator.comparing(User::getEarthCountry);
        Comparator<User> compareWithBoth = Comparator
                                                .comparing(User::getEarthJob)
                                                .thenComparing(User::getEarthCountry);
        // compare job and country or the both and sorted then transform to list
        if (sortedJob && sortedCountry) {
            result = users.stream().sorted(compareWithBoth).collect(Collectors.toList());
        } else {
            result = users.stream().sorted(
                sortedJob ? compareByJob : compareByCountry
            ).collect(Collectors.toList());
        }
        return result;
    }

    /**
     * Find the user in the memory database by its ID
     * @param userid
     * @return
     */
    public User login(String userid) {
        // Check if userid exists in memoryDatabase (ArrayList) else null
        return memoryDatabase.stream().filter(item ->
            userid.equals(item.getId())
        ).findAny().orElse(null);
    }
}
