<?php
namespace Uman\Entity;

/**
 * @Entity(repositoryClass="Uman\Repository\UserRepository")
 **/
class User implements EntityInterface
{
    /** @Column(type="string")**/
    public $name;
    /** @Id @Column(type="string")**/
    public $login;

  /**
     * @ManyToMany(targetEntity="Group")
     * @JoinTable(name="UserGroupLink",
     *      joinColumns={@JoinColumn(name="userLogin", referencedColumnName="login")},
     *      inverseJoinColumns={@JoinColumn(name="groupName", referencedColumnName="name")}
     * )
     **/
    public $groups;

    public function __construct($name, $login)
    {
        $this->name = $name;
        $this->login = $login;
        $this->groups = new \Doctrine\Common\Collections\ArrayCollection();
        return $this;
    }

    public function getId() {
        return $this->login;
    }

    public function serialize() {
        $groupIds = array_map(function($group) {
            return $group->name;
        }, $this->groups->toArray());

        return [
            'name' => $this->name,
            'login' => $this->login,
            'groupIds' => $groupIds
        ];
    }

    public static function unserialize($array) {
        $user = new self($array['name'], $array['login']);
        $user->groupIds = ($array['groupIds']);
        return $user;
    }

    public static function serializeArray($array) {
        return array_map(function($user){
            return $user->serialize();
        }, $array);
    }
}
