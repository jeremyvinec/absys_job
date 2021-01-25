package com.absys.test.service;

import com.absys.test.model.Criminal;
import com.absys.test.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.io.Console;
import java.util.*;
import java.util.stream.Stream;

@Service
public class UserService {

    @Autowired
    private SimpMessagingTemplate webSocketTemplate;

    // generate user list
    private static final List<User> memoryDatabase = new ArrayList<>();
        static {
            memoryDatabase.add(new User("SFES45", "DUPONT", "JEAN", new Date(), "FRANCE", "FARMER"));
            memoryDatabase.add(new User("SFES46", "Yvinec", "Jeremy", new Date(), "FRANCE", "Dev"));
        }
    
    private List<Criminal> earthCriminalDatabase = Criminal.earthCriminal();
    /**
     * Create an ID and a user then return the ID
     * @param user
     * @return
     */
    public User createUser(User user) {
        try {
            // generate key
            // random => UUID.randomUUID().toString()
            /*String key = "TODO : generate random string here";
            user.setId(key);
            memoryDatabase.add(user);*/
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
        User user = null;
        // fetch user from memory database

        // next step on workflow
        // CREATED -> EARTH_CONTROL -> MARS_CONTROL -> DONE
        // Check criminal list during "EARTH_CONTROL" state, if the user is in the list, set state to REFUSED
        // TODO
        // don't forget to use earthCriminalDatabase and UserState

        // send update to all users
        webSocketTemplate.convertAndSend("/workflow/states", user);
        return user;
    }


    /**
     * Return all user group by its job then its country
     * @return
     */
    public Object findByJobThenCountry() {
        // TODO : Return an Object containing user sort by Job then Country (you are not allowed to just return List<User> sorted)
        return new ArrayList<>(0);
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
