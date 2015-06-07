<?php
namespace Uman\Entity;

/**
 * @Entity(repositoryClass="Uman\Repository\GroupRepository")
 * @Table(name="Groups")
 **/
class Group implements EntityInterface
{
    /** @Id @Column(type="string") **/
    public $name;

    public function __construct($name) {
        $this->name = $name;
    }

    public function getId() {
        return $this->name;
    }

    public function serialize() {
        return [
            'name' => $this->name
        ];
    }

    public static function unserialize($array) {
        $group = new self($array['name']);
        return $group;
    }

    public static function serializeArray($array) {
        return array_map(function($group){
            return $group->serialize();
        }, $array);
    }
}
