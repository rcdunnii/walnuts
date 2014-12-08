<?php
<?php

class session {

function __construct() {
   // set our custom session functions.
   session_set_save_handler(array($this, 'open'), array($this, 'close'), array($this, 'read'), array($this, 'write'), array($this, 'destroy'), array($this, 'gc'));
 
   // This line prevents unexpected effects when using objects as save handlers.
   register_shutdown_function('session_write_close');
}

function start_session($session_name, $secure) {
   // Make sure the session cookie is not accessible via javascript.
   $httponly = true;
 
   // Hash algorithm to use for the session. (use hash_algos() to get a list of available hashes.)
   $session_hash = 'sha512';
 
   // Check if hash is available
   if (in_array($session_hash, hash_algos())) {
      // Set the has function.
      ini_set('session.hash_function', $session_hash);
   }
   // How many bits per character of the hash.
   // The possible values are '4' (0-9, a-f), '5' (0-9, a-v), and '6' (0-9, a-z, A-Z, "-", ",").
   ini_set('session.hash_bits_per_character', 5);
 
   // Force the session to only use cookies, not URL variables.
   ini_set('session.use_only_cookies', 1);
 
   // Get session cookie parameters 
   $cookieParams = session_get_cookie_params(); 
   // Set the parameters
   session_set_cookie_params($cookieParams["lifetime"], $cookieParams["path"], $cookieParams["domain"], $secure, $httponly); 
   // Change the session name 
   session_name($session_name);
   // Now we cat start the session
   session_start();
   // This line regenerates the session and delete the old one. 
   // It also generates a new encryption key in the database. 
   session_regenerate_id(true); 
}
!!!! set right password for sec_user *******************
function open() {
   $host = 'localhost';
   $user = 'sec_user';
   $pass = 'eKcGZr59zAa2BEWU';
   $name = 'secure_sessions';
   $mysqli = new mysqli($host, $user, $pass, $name);
   $this->db = $mysqli;
   return true;
}
function close() {
   $this->db->close();
   return true;
}

function read($id) {
   if(!isset($this->read_stmt)) {
      $this->read_stmt = $this->db->prepare("SELECT data FROM sessions WHERE id = ? LIMIT 1");
   }
   $this->read_stmt->bind_param('s', $id);
   $this->read_stmt->execute();
   $this->read_stmt->store_result();
   $this->read_stmt->bind_result($data);
   $this->read_stmt->fetch();
   $key = $this->getkey($id);
   $data = $this->decrypt($data, $key);
   return $data;
}

function write($id, $data) {
   // Get unique key
   $key = $this->getkey($id);
   // Encrypt the data
   $data = $this->encrypt($data, $key);
 
   $time = time();
   if(!isset($this->w_stmt)) {
      $this->w_stmt = $this->db->prepare("REPLACE INTO sessions (id, set_time, data, session_key) VALUES (?, ?, ?, ?)");
   }
 
   $this->w_stmt->bind_param('siss', $id, $time, $data, $key);
   $this->w_stmt->execute();
   return true;
}

function destroy($id) {
   if(!isset($this->delete_stmt)) {
      $this->delete_stmt = $this->db->prepare("DELETE FROM sessions WHERE id = ?");
   }
   $this->delete_stmt->bind_param('s', $id);
   $this->delete_stmt->execute();
   return true;
}

private function getkey($id) {
   if(!isset($this->key_stmt)) {
      $this->key_stmt = $this->db->prepare("SELECT session_key FROM sessions WHERE id = ? LIMIT 1");
   }
   $this->key_stmt->bind_param('s', $id);
   $this->key_stmt->execute();
   $this->key_stmt->store_result();
   if($this->key_stmt->num_rows == 1) { 
      $this->key_stmt->bind_result($key);
      $this->key_stmt->fetch();
      return $key;
   } else {
      $random_key = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
      return $random_key;
   }
}

private function encrypt($data, $key) {
   $salt = 'cH!swe!retReGu7W6bEDRup7usuDUh9THeD2CHeGE*ewr4n39=E@rAsp7c-Ph@pH';
   $key = substr(hash('sha256', $salt.$key.$salt), 0, 32);
   $iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB);
   $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
   $encrypted = base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $key, $data, MCRYPT_MODE_ECB, $iv));
   return $encrypted;
}
private function decrypt($data, $key) {
   $salt = 'cH!swe!retReGu7W6bEDRup7usuDUh9THeD2CHeGE*ewr4n39=E@rAsp7c-Ph@pH';
   $key = substr(hash('sha256', $salt.$key.$salt), 0, 32);
   $iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB);
   $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
   $decrypted = mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $key, base64_decode($data), MCRYPT_MODE_ECB, $iv);
   return $decrypted;
}

} // end class

function login($email, $password, $mysqli) {
    // Using prepared statements means that SQL injection is not possible. 
    if ($stmt = $mysqli->prepare("SELECT id, username, password, salt 
        FROM members
       WHERE email = ?
        LIMIT 1")) {
        $stmt->bind_param('s', $email);  // Bind "$email" to parameter.
        $stmt->execute();    // Execute the prepared query.
        $stmt->store_result();
 
        // get variables from result.
        $stmt->bind_result($user_id, $username, $db_password, $salt);
        $stmt->fetch();
 
        // hash the password with the unique salt.
        $password = hash('sha512', $password . $salt);
        if ($stmt->num_rows == 1) {
            // If the user exists we check if the account is locked
            // from too many login attempts 
 
            if (checkbrute($user_id, $mysqli) == true) {
                // Account is locked 
                // Send an email to user saying their account is locked
                return false;
            } else {
                // Check if the password in the database matches
                // the password the user submitted.
                if ($db_password == $password) {
                    // Password is correct!
                    // Get the user-agent string of the user.
                    $user_browser = $_SERVER['HTTP_USER_AGENT'];
                    // XSS protection as we might print this value
                    $user_id = preg_replace("/[^0-9]+/", "", $user_id);
                    $_SESSION['user_id'] = $user_id;
                    // XSS protection as we might print this value
                    $username = preg_replace("/[^a-zA-Z0-9_\-]+/", 
                                                                "", 
                                                                $username);
                    $_SESSION['username'] = $username;
                    $_SESSION['login_string'] = hash('sha512', 
                              $password . $user_browser);
                    // Login successful.
                    return true;
                } else {
                    // Password is not correct
                    // We record this attempt in the database
                    $now = time();
                    $mysqli->query("INSERT INTO login_attempts(user_id, time)
                                    VALUES ('$user_id', '$now')");
                    return false;
                }
            }
        } else {
            // No user exists.
            return false;
        }
    }
}
function checkbrute($user_id, $mysqli) {
    // Get timestamp of current time 
    $now = time();
 
    // All login attempts are counted from the past 2 hours. 
    $valid_attempts = $now - (2 * 60 * 60);
 
    if ($stmt = $mysqli->prepare("SELECT time 
                             FROM login_attempts 
                             WHERE user_id = ? 
                            AND time > '$valid_attempts'")) {
        $stmt->bind_param('i', $user_id);
 
        // Execute the prepared query. 
        $stmt->execute();
        $stmt->store_result();
 
        // If there have been more than 5 failed logins 
        if ($stmt->num_rows > 5) {
            return true;
        } else {
            return false;
        }
    }
}

function login_check($mysqli) {
    // Check if all session variables are set 
    if (isset($_SESSION['user_id'], 
                        $_SESSION['username'], 
                        $_SESSION['login_string'])) {
 
        $user_id = $_SESSION['user_id'];
        $login_string = $_SESSION['login_string'];
        $username = $_SESSION['username'];
 
        // Get the user-agent string of the user.
        $user_browser = $_SERVER['HTTP_USER_AGENT'];
 
        if ($stmt = $mysqli->prepare("SELECT password 
                                      FROM members 
                                      WHERE id = ? LIMIT 1")) {
            // Bind "$user_id" to parameter. 
            $stmt->bind_param('i', $user_id);
            $stmt->execute();   // Execute the prepared query.
            $stmt->store_result();
 
            if ($stmt->num_rows == 1) {
                // If the user exists get variables from result.
                $stmt->bind_result($password);
                $stmt->fetch();
                $login_check = hash('sha512', $password . $user_browser);
 
                if ($login_check == $login_string) {
                    // Logged In!!!! 
                    return true;
                } else {
                    // Not logged in 
                    return false;
                }
            } else {
                // Not logged in 
                return false;
            }
        } else {
            // Not logged in 
            return false;
        }
    } else {
        // Not logged in 
        return false;
    }
}

function esc_url($url) {
 
    if ('' == $url) {
        return $url;
    }
 
    $url = preg_replace('|[^a-z0-9-~+_.?#=!&;,/:%@$\|*\'()\\x80-\\xff]|i', '', $url);
 
    $strip = array('%0d', '%0a', '%0D', '%0A');
    $url = (string) $url;
 
    $count = 1;
    while ($count) {
        $url = str_replace($strip, '', $url, $count);
    }
 
    $url = str_replace(';//', '://', $url);
 
    $url = htmlentities($url);
 
    $url = str_replace('&amp;', '&#038;', $url);
    $url = str_replace("'", '&#039;', $url);
 
    if ($url[0] !== '/') {
        // We're only interested in relative links from $_SERVER['PHP_SELF']
        return '';
    } else {
        return $url;
    }
}

?>





function login($email, $password, $mysqli) {
    // Using prepared statements means that SQL injection is not possible. 
    if ($stmt = $mysqli->prepare("SELECT id, username, password, salt 
        FROM members
       WHERE email = ?
        LIMIT 1")) {
        $stmt->bind_param('s', $email);  // Bind "$email" to parameter.
        $stmt->execute();    // Execute the prepared query.
        $stmt->store_result();
 
        // get variables from result.
        $stmt->bind_result($user_id, $username, $db_password, $salt);
        $stmt->fetch();
 
        // hash the password with the unique salt.
        $password = hash('sha512', $password . $salt);
        if ($stmt->num_rows == 1) {
            // If the user exists we check if the account is locked
            // from too many login attempts 
 
            if (checkbrute($user_id, $mysqli) == true) {
                // Account is locked 
                // Send an email to user saying their account is locked
                return false;
            } else {
                // Check if the password in the database matches
                // the password the user submitted.
                if ($db_password == $password) {
                    // Password is correct!
                    // Get the user-agent string of the user.
                    $user_browser = $_SERVER['HTTP_USER_AGENT'];
                    // XSS protection as we might print this value
                    $user_id = preg_replace("/[^0-9]+/", "", $user_id);
                    $_SESSION['user_id'] = $user_id;
                    // XSS protection as we might print this value
                    $username = preg_replace("/[^a-zA-Z0-9_\-]+/", 
                                                                "", 
                                                                $username);
                    $_SESSION['username'] = $username;
                    $_SESSION['login_string'] = hash('sha512', 
                              $password . $user_browser);
                    // Login successful.
                    return true;
                } else {
                    // Password is not correct
                    // We record this attempt in the database
                    $now = time();
                    $mysqli->query("INSERT INTO login_attempts(user_id, time)
                                    VALUES ('$user_id', '$now')");
                    return false;
                }
            }
        } else {
            // No user exists.
            return false;
        }
    }
}